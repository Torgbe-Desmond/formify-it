import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { schemaApi } from '../api/apiClient';

// ── Helpers ───────────────────────────────────────────────────────

/**
 * Normalise whatever the server returns into the multi-schema shape.
 * Handles old flat shape { schemaYaml, templateHtml, templateCss }
 * as well as the new shape { schemas: {…}, entrySchema }.
 */
function normaliseServerSchema(data) {
  if (!data) return null;

  // Already new shape
  if (data.schemas && typeof data.schemas === 'object') return data;

  // Old flat shape — wrap into Main entry
  return {
    ...data,
    entrySchema: 'Main',
    schemas: {
      Main: {
        schemaYaml:   data.schemaYaml   || '',
        templateHtml: data.templateHtml || '',
        templateCss:  data.templateCss  || '',
      },
    },
  };
}

// ── Thunks ────────────────────────────────────────────────────────

export const loadSchema = createAsyncThunk(
  'schema/load',
  async ({ folderId }, { rejectWithValue }) => {
    try {
      const res = await schemaApi.get(folderId);
      return normaliseServerSchema(res.data);
    } catch (err) {
      if (err.response?.status === 404) return null;
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Upsert the full multi-schema payload.
 * Callers pass { folderId, schemas, entrySchema }.
 */
export const upsertSchema = createAsyncThunk(
  'schema/upsert',
  async ({ folderId, schemas, entrySchema }) => {
    const res = await schemaApi.upsert(folderId, { schemas, entrySchema });
    return normaliseServerSchema(res.data);
  }
);

// ── Slice ─────────────────────────────────────────────────────────
const schemaSlice = createSlice({
  name: 'schema',
  initialState: {
    byFolder: {},   // folderId → normalised schema object
    loading:  false,
    error:    null,
  },
  reducers: {
    /**
     * Optimistically update a single named schema inside a folder
     * without a round-trip. Used by the editor for instant feedback.
     */
    updateNamedSchema(state, action) {
      const { folderId, schemaName, patch } = action.payload;
      const folder = state.byFolder[folderId];
      if (!folder) return;
      folder.schemas = {
        ...folder.schemas,
        [schemaName]: { ...(folder.schemas[schemaName] || {}), ...patch },
      };
    },

    setEntrySchema(state, action) {
      const { folderId, entrySchema } = action.payload;
      if (state.byFolder[folderId]) {
        state.byFolder[folderId].entrySchema = entrySchema;
      }
    },

    addNamedSchema(state, action) {
      const { folderId, schemaName } = action.payload;
      const folder = state.byFolder[folderId];
      if (!folder) return;
      if (!folder.schemas[schemaName]) {
        folder.schemas[schemaName] = { schemaYaml: '', templateHtml: '', templateCss: '' };
      }
    },

    removeNamedSchema(state, action) {
      const { folderId, schemaName } = action.payload;
      const folder = state.byFolder[folderId];
      if (!folder) return;
      delete folder.schemas[schemaName];
      // If we deleted the entry schema, pick another one
      if (folder.entrySchema === schemaName) {
        folder.entrySchema = Object.keys(folder.schemas)[0] || '';
      }
    },

    renameNamedSchema(state, action) {
      const { folderId, oldName, newName } = action.payload;
      const folder = state.byFolder[folderId];
      if (!folder || !folder.schemas[oldName] || folder.schemas[newName]) return;
      folder.schemas[newName] = folder.schemas[oldName];
      delete folder.schemas[oldName];
      if (folder.entrySchema === oldName) folder.entrySchema = newName;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSchema.pending,   (state) => { state.loading = true; })
      .addCase(loadSchema.fulfilled, (state, action) => {
        state.loading = false;
        const folderId = action.meta.arg.folderId;
        if (action.payload) {
          state.byFolder[folderId] = action.payload;
        } else {
          // No schema yet — seed an empty one
          state.byFolder[folderId] = {
            folderId,
            entrySchema: 'Main',
            schemas: {
              Main: { schemaYaml: '', templateHtml: '', templateCss: '' },
            },
          };
        }
      })
      .addCase(loadSchema.rejected, (state) => { state.loading = false; })

      .addCase(upsertSchema.fulfilled, (state, action) => {
        if (action.payload) {
          state.byFolder[action.payload.folderId] = action.payload;
        }
      });
  },
});

export const {
  updateNamedSchema,
  setEntrySchema,
  addNamedSchema,
  removeNamedSchema,
  renameNamedSchema,
} = schemaSlice.actions;

export default schemaSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────

export const selectSchemaByFolder = (folderId) => (state) =>
  state.schema.byFolder[folderId] || null;

/** Returns the entry schema definition (schemaYaml, templateHtml, templateCss) */
export const selectEntrySchemaData = (folderId) => (state) => {
  const folder = state.schema.byFolder[folderId];
  if (!folder) return null;
  return folder.schemas?.[folder.entrySchema] || null;
};

/** Returns just the schemas map { [name]: { schemaYaml, … } } */
export const selectSchemasMap = (folderId) => (state) =>
  state.schema.byFolder[folderId]?.schemas || {};

/** Returns the entry schema name string */
export const selectEntrySchemaName = (folderId) => (state) =>
  state.schema.byFolder[folderId]?.entrySchema || '';