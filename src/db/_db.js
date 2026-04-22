import Dexie from 'dexie';

/**
 * Local IndexedDB schema mirroring the backend.
 *
 * Tables:
 *   projects    — mirrors backend Project entity
 *   folders     — mirrors backend Folder entity
 *   files       — mirrors backend AppFile (list info, no content)
 *   fileContent — stores rendered HTML content separately (mirrors FileContent)
 *   schemas     — mirrors backend SchemaTemplate (multi-schema shape)
 *   syncQueue   — pending operations to push when back online
 *
 * schemas row shape:
 * {
 *   id,
 *   folderId,
 *   entrySchema,   // string — name of the root schema to render for files
 *   schemas: {     // map of named schema definitions
 *     [SchemaName]: {
 *       schemaYaml:   string,
 *       templateHtml: string | null,  // only meaningful on the entry schema
 *       templateCss:  string | null,  // only meaningful on the entry schema
 *     }
 *   },
 *   updatedAt,
 *   _synced,
 * }
 */
export const db = new Dexie('FastTransfersDB');

// Version 1 — original flat schema shape
db.version(1).stores({
  projects:    'id, name, ownerId, createdAt, updatedAt, _synced',
  folders:     'id, name, projectId, createdAt, updatedAt, _synced',
  files:       'id, name, folderId, sizeBytes, createdAt, updatedAt, _synced',
  fileContent: 'id, fileId, content, updatedAt',
  schemas:     'id, folderId, updatedAt, _synced',
  syncQueue:   '++id, entity, operation, entityId, createdAt, _attempts',
});

// Version 2 — multi-schema shape
// The indexed columns stay the same; the new fields (entrySchema, schemas map)
// are stored as non-indexed JSON — Dexie handles this automatically.
// Existing rows are migrated: the old schemaYaml/templateHtml/templateCss
// are wrapped into a single "Main" entry schema.
db.version(2).stores({
  projects:    'id, name, ownerId, createdAt, updatedAt, _synced',
  folders:     'id, name, projectId, createdAt, updatedAt, _synced',
  files:       'id, name, folderId, sizeBytes, createdAt, updatedAt, _synced',
  fileContent: 'id, fileId, content, updatedAt',
  schemas:     'id, folderId, updatedAt, _synced',
  syncQueue:   '++id, entity, operation, entityId, createdAt, _attempts',
}).upgrade((tx) => {
  return tx.table('schemas').toCollection().modify((row) => {
    // Only migrate rows that are still in the old flat shape
    if (row.schemaYaml !== undefined || row.templateHtml !== undefined) {
      row.entrySchema = 'Main';
      row.schemas = {
        Main: {
          schemaYaml:   row.schemaYaml   || '',
          templateHtml: row.templateHtml || '',
          templateCss:  row.templateCss  || '',
        },
      };
      // Remove the old flat fields
      delete row.schemaYaml;
      delete row.templateHtml;
      delete row.templateCss;
    }
  });
});

export default db;
