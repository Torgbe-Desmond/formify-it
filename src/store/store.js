import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectsReducer from './slices/projectsSlice';
import foldersReducer from './slices/foldersSlice';
import filesReducer from './slices/filesSlice';
import schemaReducer from './slices/schemaSlice';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    folders: foldersReducer,
    files: filesReducer,
    schema: schemaReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      
      // Dexie objects are non-serializable — ignore them in middleware checks
      serializableCheck: {
        ignoredActions: [
          'projects/load/fulfilled',
          'folders/load/fulfilled',
          'files/load/fulfilled',
          'files/loadById/fulfilled',
          'schema/load/fulfilled',
        ],
      },
    }).concat(apiSlice.middleware),
});

export default store;
