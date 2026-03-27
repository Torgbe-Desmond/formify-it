import db from '../db/_db';

/**
 * Add an operation to the sync queue.
 * Called whenever an API call fails or the device is offline.
 */
export async function enqueueSyncOperation(entity, operation, entityId, payload) {
  await db.syncQueue.add({
    entity,
    operation,
    entityId,
    payload: JSON.stringify(payload),
    createdAt: new Date().toISOString(),
    _attempts: 0,
  });
}

/** Get all pending operations ordered by creation time */
export async function getPendingOperations() {
  return db.syncQueue.orderBy('createdAt').toArray();
}

/** Remove a successfully synced operation */
export async function removeSyncOperation(id) {
  await db.syncQueue.delete(id);
}

/** Increment retry count — operations that fail 5+ times are abandoned */
export async function incrementAttempts(id) {
  const op = await db.syncQueue.get(id);
  if (op) await db.syncQueue.update(id, { _attempts: op._attempts + 1 });
}
