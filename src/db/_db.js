import Dexie from 'dexie';

/**
 * Local IndexedDB schema mirroring the backend.
 *
 * Tables:
 *   projects    — mirrors backend Project entity
 *   folders     — mirrors backend Folder entity
 *   files       — mirrors backend AppFile (list info, no content)
 *   fileContent — stores rendered HTML content separately (mirrors FileContent)
 *   schemas     — mirrors backend SchemaTemplate
 *   syncQueue   — pending operations to push when back online
 */
export const db = new Dexie('FastTransfersDB');

db.version(1).stores({
  // Core data tables
  projects:    'id, name, ownerId, createdAt, updatedAt, _synced',
  folders:     'id, name, projectId, createdAt, updatedAt, _synced',
  files:       'id, name, folderId, sizeBytes, createdAt, updatedAt, _synced',
  fileContent: 'id, fileId, content, updatedAt',   // separate so list queries stay fast
  schemas:     'id, folderId, updatedAt, _synced',

  // Offline sync queue — one row per pending operation
  // operation: 'CREATE' | 'UPDATE' | 'DELETE'
  // entity:    'project' | 'folder' | 'file' | 'schema'
  syncQueue:   '++id, entity, operation, entityId, createdAt, _attempts',
});

export default db;
