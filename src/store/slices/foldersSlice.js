import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { foldersApi } from '../api/apiClient';

// ── Thunks ────────────────────────────────────────────────────────

export const loadFoldersFromServer = createAsyncThunk(
  'folders/loadFromServer',
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const res = await foldersApi.getByProject(projectId);
      return { projectId, folders: res.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadFolders = ({ projectId }) => (dispatch) => {
  dispatch(loadFoldersFromServer({ projectId }));
};

export const createFolder = createAsyncThunk(
  'folders/create',
  async ({ name, projectId }) => {
    const res = await foldersApi.create(projectId, { name });
    return { serverFolder: res.data, projectId };
  }
);

export const renameFolder = createAsyncThunk(
  'folders/rename',
  async ({ id, name }) => {
    const res = await foldersApi.rename(id, { name });
    return res.data;
  }
);

export const deleteFolder = createAsyncThunk(
  'folders/delete',
  async ({ id }) => {
    await foldersApi.delete(id);
    return id;
  }
);

// ── Slice ─────────────────────────────────────────────────────────
const foldersSlice = createSlice({
  name: 'folders',
  initialState: {
    byProject: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFoldersFromServer.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadFoldersFromServer.fulfilled, (state, action) => {
        const { projectId, folders } = action.payload;
        state.byProject[projectId] = [...folders].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        state.loading = false;

      })
      .addCase(loadFoldersFromServer.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(createFolder.fulfilled, (state, action) => {
        const { serverFolder, projectId } = action.payload;
        const list = state.byProject[projectId] || [];
        state.byProject[projectId] = [serverFolder, ...list].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      })

      .addCase(renameFolder.fulfilled, (state, action) => {
        const folder = action.payload;
        Object.keys(state.byProject).forEach((pid) => {
          const idx = state.byProject[pid].findIndex((f) => f.id === folder.id);
          if (idx !== -1) {
            state.byProject[pid][idx] = { ...state.byProject[pid][idx], ...folder };
          }
        });
      })

      .addCase(deleteFolder.fulfilled, (state, action) => {
        const id = action.payload;
        Object.keys(state.byProject).forEach((pid) => {
          state.byProject[pid] = state.byProject[pid].filter((f) => f.id !== id);
        });
      });
  },
});

export default foldersSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────
export const selectFoldersByProject = (projectId) => (state) =>
  state.folders.byProject[projectId] || [];

export const selectFolderById = (id) => (state) => {
  for (const folders of Object.values(state.folders.byProject)) {
    const found = folders.find((f) => f.id === id);
    if (found) return found;
  }
  return null;
};

export const selectFoldersLoading = (state) => state.folders.loading;