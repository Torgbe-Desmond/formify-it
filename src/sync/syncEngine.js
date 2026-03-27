import { projectsApi, foldersApi, filesApi, schemaApi } from '../store/api/apiClient';
import {
  getPendingOperations,
  removeSyncOperation,
  incrementAttempts,
} from './syncQueue';
import db from '../db/_db';

const MAX_ATTEMPTS = 5;

/**
 * Process a single queued operation against the API.
 */
async function processOperation(op) {
  const payload = JSON.parse(op.payload || '{}');

  switch (op.entity) {

    // ── Projects ───────────────────────────────────────────
    case 'project': {
      switch (op.operation) {
        case 'CREATE': {
          const res = await projectsApi.create({ name: payload.name });
          // Update local record with server response
          await db.projects.put({ ...res.data, _synced: true });
          break;
        }
        case 'UPDATE': {
          const res = await projectsApi.rename(op.entityId, { name: payload.name });
          await db.projects.update(op.entityId, { ...res.data, _synced: true });
          break;
        }
        case 'DELETE': {
          await projectsApi.delete(op.entityId);
          break;
        }
      }
      break;
    }

    // ── Folders ────────────────────────────────────────────
    case 'folder': {
      switch (op.operation) {
        case 'CREATE': {
          const res = await foldersApi.create(payload.projectId, { name: payload.name });
          await db.folders.put({ ...res.data, _synced: true });
          break;
        }
        case 'UPDATE': {
          const res = await foldersApi.rename(op.entityId, { name: payload.name });
          await db.folders.update(op.entityId, { ...res.data, _synced: true });
          break;
        }
        case 'DELETE': {
          await foldersApi.delete(op.entityId);
          break;
        }
      }
      break;
    }

    // ── Files ──────────────────────────────────────────────
    case 'file': {
      switch (op.operation) {
        case 'CREATE': {
          const res = await filesApi.create(payload.folderId, {
            name:        payload.name,
            renderedHtml: payload.renderedHtml,
            metadata:    payload.metadata,
          });
          await db.files.put({ ...res.data, _synced: true });
          break;
        }
        case 'UPDATE': {
          const res = await filesApi.update(op.entityId, {
            name:        payload.name,
            renderedHtml: payload.renderedHtml,
            metadata:    payload.metadata,
          });
          await db.files.update(op.entityId, { ...res.data, _synced: true });
          break;
        }
        case 'DELETE': {
          await filesApi.delete(op.entityId);
          break;
        }
      }
      break;
    }

    // ── Schema ─────────────────────────────────────────────
    case 'schema': {
      const res = await schemaApi.upsert(op.entityId, {
        schemaYaml:   payload.schemaYaml,
        templateHtml: payload.templateHtml,
        templateCss:  payload.templateCss,
      });
      const existing = await db.schemas.where('folderId').equals(op.entityId).first();
      if (existing) {
        await db.schemas.update(existing.id, { ...res.data, _synced: true });
      }
      break;
    }

    default:
      console.warn('Unknown sync entity:', op.entity);
  }
}

/**
 * Run all pending sync operations in order.
 * Called when the app detects an internet connection.
 */
export async function runSync() {
  if (!navigator.onLine) return;

  const pending = await getPendingOperations();

  if (pending.length === 0) return;

  console.log(`[Sync] Processing ${pending.length} pending operations...`);

  for (const op of pending) {
    if (op._attempts >= MAX_ATTEMPTS) {
      console.warn(`[Sync] Abandoning operation ${op.id} after ${MAX_ATTEMPTS} attempts`);
      await removeSyncOperation(op.id);
      continue;
    }

    try {
      await processOperation(op);
      await removeSyncOperation(op.id);
      console.log(`[Sync] ✓ ${op.entity} ${op.operation} ${op.entityId}`);
    } catch (err) {
      console.error(`[Sync] ✗ ${op.entity} ${op.operation} failed:`, err.message);
      await incrementAttempts(op.id);
    }
  }

  console.log('[Sync] Done.');
}

/**
 * Start the sync engine.
 * Listens for online events and runs sync when connectivity is restored.
 * Also runs immediately if already online and queue has items.
 */
export function startSyncEngine() {
  // Run on initial load if online
  runSync();

  // Run whenever the browser comes back online
  window.addEventListener('online', () => {
    console.log('[Sync] Back online — starting sync...');
    runSync();
  });

  // Periodic sync every 2 minutes as a safety net
  setInterval(() => {
    if (navigator.onLine) runSync();
  }, 2 * 60 * 1000);
}
