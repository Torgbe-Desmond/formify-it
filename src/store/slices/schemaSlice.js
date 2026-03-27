import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { schemaApi } from '../api/apiClient';

// ── Thunks ────────────────────────────────────────────────────────

export const loadSchema = createAsyncThunk(
  'schema/load',
  async ({ folderId }, { rejectWithValue }) => {
    try {
      const res = await schemaApi.get(folderId);
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) return null;
      return rejectWithValue(err.message);
    }
  }
);

export const upsertSchema = createAsyncThunk(
  'schema/upsert',
  async ({ folderId, schemaYaml, templateHtml, templateCss }) => {
    const res = await schemaApi.upsert(folderId, { schemaYaml, templateHtml, templateCss });
    return res.data;
  }
);

// ── Slice ─────────────────────────────────────────────────────────
const schemaSlice = createSlice({
  name: 'schema',
  initialState: {
    byFolder: {},  // folderId → schema object
    loading:  false,
    error:    null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSchema.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadSchema.fulfilled, (state, action) => {
        state.loading = false;
        const folderId = action.meta.arg.folderId;
        if (action.payload) {
          state.byFolder[folderId] = action.payload;
        } else {
          delete state.byFolder[folderId];
        }
      })
      .addCase(loadSchema.rejected, (state) => {
        state.loading = false;
      })

      .addCase(upsertSchema.fulfilled, (state, action) => {
        state.byFolder[action.payload.folderId] = action.payload;
      });
  },
});

export default schemaSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────
export const selectSchemaByFolder = (folderId) => (state) =>
  state.schema.byFolder[folderId] || null;