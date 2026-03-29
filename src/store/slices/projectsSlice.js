import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectsApi } from '../api/apiClient';

// ── Thunks ────────────────────────────────────────────────────────

export const loadProjectsFromServer = createAsyncThunk(
  'projects/loadFromServer',
  async (_, { rejectWithValue }) => {
    try {
      const res = await projectsApi.getAll();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadProjects = () => (dispatch) => {
  dispatch(loadProjectsFromServer());
};

export const createProject = createAsyncThunk(
  'projects/create',
  async ({ name }) => {
    const res = await projectsApi.create({ name });
    return res.data;
  }
);

export const renameProject = createAsyncThunk(
  'projects/rename',
  async ({ id, name }) => {
    const res = await projectsApi.rename(id, { name });
    return res.data;
  }
);

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async ({ id }) => {
    await projectsApi.delete(id);
    return id;
  }
);

// ── Slice ─────────────────────────────────────────────────────────
const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items:   [],
    loading: false,
    error:   null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProjectsFromServer.fulfilled, (state, action) => {
        state.items = [...action.payload].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      })
      .addCase(loadProjectsFromServer.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(createProject.fulfilled, (state, action) => {
        console.log("payload", action.payload)
        state.items.unshift(action.payload);
      })

      .addCase(renameProject.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = { ...state.items[idx], ...action.payload };
        }
      })

      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default projectsSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────
export const selectProjects = (state) => state.projects.items;
export const selectProjectsLoading = (state) => state.projects.loading;
export const selectProjectById = (id) => (state) =>
  state.projects.items.find((p) => p.id === id);