import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = ['https://formify-node.onrender.com', 'http://localhost:5000'][0];

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Handle 401 globally
const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Project', 'Folder', 'File'],
  endpoints: (builder) => ({

    // ── Auth ─────────────────────────────────────
    register: builder.mutation({
      query: (data) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: data,
      }),
    }),

    // ── Projects ─────────────────────────────────
    getProjects: builder.query({
      query: () => '/api/projects',
      providesTags: ['Project'],
    }),

    getProjectById: builder.query({
      query: (id) => `/api/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),

    createProject: builder.mutation({
      query: (data) => ({
        url: '/api/projects',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Project'],
    }),

    renameProject: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/projects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Project'],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/api/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),

    // ── Folders ──────────────────────────────────
    getFoldersByProject: builder.query({
      query: (projectId) => `/api/projects/${projectId}/folders`,
      providesTags: ['Folder'],
    }),

    createFolder: builder.mutation({
      query: ({ projectId, data }) => ({
        url: `/api/projects/${projectId}/folders`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Folder'],
    }),

    renameFolder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/folders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Folder'],
    }),

    deleteFolder: builder.mutation({
      query: (id) => ({
        url: `/api/folders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Folder'],
    }),

    // ── Schema ───────────────────────────────────
    getSchema: builder.query({
      query: (folderId) => `/api/folders/${folderId}/schema`,
    }),

    upsertSchema: builder.mutation({
      query: ({ folderId, data }) => ({
        url: `/api/folders/${folderId}/schema`,
        method: 'PUT',
        body: data,
      }),
    }),

    // ── Files ────────────────────────────────────
    getFilesByFolder: builder.query({
      query: (folderId) => `/api/folders/${folderId}/files`,
      providesTags: ['File'],
    }),

    getFileById: builder.query({
      query: (id) => `/api/files/${id}`,
    }),

    createFile: builder.mutation({
      query: ({ folderId, data }) => ({
        url: `/api/folders/${folderId}/files`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['File'],
    }),

    updateFile: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/files/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['File'],
    }),

    deleteFile: builder.mutation({
      query: (id) => ({
        url: `/api/files/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['File'],
    }),

    // ── Breadcrumb ───────────────────────────────
    getBreadcrumb: builder.query({
      query: ({ type, id }) => `/api/breadcrumb/${type}/${id}`,
    }),

  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,

  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useRenameProjectMutation,
  useDeleteProjectMutation,

  useGetFoldersByProjectQuery,
  useCreateFolderMutation,
  useRenameFolderMutation,
  useDeleteFolderMutation,

  useGetSchemaQuery,
  useUpsertSchemaMutation,

  useGetFilesByFolderQuery,
  useGetFileByIdQuery,
  useCreateFileMutation,
  useUpdateFileMutation,
  useDeleteFileMutation,

  useGetBreadcrumbQuery,
} = apiSlice;