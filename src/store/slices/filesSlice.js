import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { filesApi } from '../api/apiClient';

// ── Thunks ────────────────────────────────────────────────────────

export const loadFilesFromServer = createAsyncThunk(
  'files/loadFromServer',
  async ({ folderId }, { rejectWithValue }) => {
    try {
      const res = await filesApi.getByFolder(folderId);
      return { folderId, files: res.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadFiles = ({ folderId }) => (dispatch) => {
  dispatch(loadFilesFromServer({ folderId }));
};

export const loadFileById = createAsyncThunk(
  'files/loadById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await filesApi.getById(id);
      const { file, content } = res.data;
      return { file, content };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createFile = createAsyncThunk(
  'files/create',
  async ({ name, folderId, renderedHtml, metadata }) => {
    const res = await filesApi.create(folderId, { name, renderedHtml, metadata });
    return { serverFile: res.data, folderId };
  }
);

export const updateFile = createAsyncThunk(
  'files/update',
  async ({ id, name, renderedHtml, metadata }) => {
    const res = await filesApi.update(id, { name, renderedHtml, metadata });
    return res.data;
  }
);

export const deleteFile = createAsyncThunk(
  'files/delete',
  async ({ id }) => {
    await filesApi.delete(id);
    return id;
  }
);

// ── Slice ─────────────────────────────────────────────────────────
const filesSlice = createSlice({
  name: 'files',
  initialState: {
    byFolder:       {},
    currentFile:    null,
    currentContent: '',
    loading:        false,
    error:          null,
  },
  reducers: {
    clearCurrentFile(state) {
      state.currentFile = null;
      state.currentContent = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Load files by folder
      .addCase(loadFilesFromServer.fulfilled, (state, action) => {
        const { folderId, files } = action.payload;
        state.byFolder[folderId] = [...files].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      })

      // Load single file
      .addCase(loadFileById.pending, (state) => { state.loading = true; })
      .addCase(loadFileById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFile = action.payload.file;
        state.currentContent = action.payload.content;
      })
      .addCase(loadFileById.rejected, (state) => { state.loading = false; })

      // Create file
      .addCase(createFile.fulfilled, (state, action) => {
        const { serverFile, folderId } = action.payload;
        const list = state.byFolder[folderId] || [];
        state.byFolder[folderId] = [serverFile, ...list].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      })

      // Update file
      .addCase(updateFile.fulfilled, (state, action) => {
        const file = action.payload;
        if (state.currentFile?.id === file.id) {
          state.currentFile = { ...state.currentFile, ...file };
        }
        Object.keys(state.byFolder).forEach((fid) => {
          const idx = state.byFolder[fid].findIndex((f) => f.id === file.id);
          if (idx !== -1) {
            state.byFolder[fid][idx] = { ...state.byFolder[fid][idx], ...file };
          }
        });
      })

      // Delete file
      .addCase(deleteFile.fulfilled, (state, action) => {
        const id = action.payload;
        Object.keys(state.byFolder).forEach((fid) => {
          state.byFolder[fid] = state.byFolder[fid].filter((f) => f.id !== id);
        });
        if (state.currentFile?.id === id) {
          state.currentFile = null;
          state.currentContent = '';
        }
      });
  },
});

export const { clearCurrentFile } = filesSlice.actions;
export default filesSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────
export const selectFilesByFolder = (folderId) => (state) =>
  state.files.byFolder[folderId] || [];

export const selectCurrentFile = (state) => state.files.currentFile;
export const selectCurrentContent = (state) => state.files.currentContent;
export const selectFilesLoading = (state) => state.files.loading;