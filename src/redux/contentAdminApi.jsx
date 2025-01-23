import { createApi } from '@reduxjs/toolkit/query/react';
import supabase from '../config/supabaseClient';

// Base query function for Supabase
const supabaseBaseQuery = async ({ url, method, body }) => {
  let supabaseQuery;
  switch (method) {
    case 'select':
      supabaseQuery = supabase.from(url).select(body);
      break;
    case 'insert':
      supabaseQuery = supabase.from(url).insert(body);
      break;
    case 'update':
      supabaseQuery = supabase.from(url).update(body).eq('content_id', body.content_id).select(); // Use content_id for updating
      break;
    case 'upsert':
      supabaseQuery = supabase.from(url).upsert(body, { onConflict: 'content_id' }).select(); // Upsert with content_id
      break;
    case 'delete':
      supabaseQuery = supabase.from(url).delete().eq('content_id', body.content_id);
      break;
    default:
      return { error: { status: 'CUSTOM_ERROR', data: 'Invalid method' } };
  }

  const { data, error } = await supabaseQuery;
  if (error) {
    console.error('Error in Supabase query:', error);
    return { error: { status: 'CUSTOM_ERROR', data: error.message } };
  }

  return { data };
};

// API Definition for admin-side content management using `content_id`
export const contentAdminApi = createApi({
  reducerPath: 'contentAdminApi',
  baseQuery: supabaseBaseQuery,
  tagTypes: ['Content'],
  endpoints: (builder) => ({
    // Fetch Content by content_id
    getContentById: builder.query({
      query: (content_id) => ({
        url: `content?content_id=eq.${content_id}`,
        method: 'select',
        body: '*',
      }),
      providesTags: ['Content'],
    }),

    getAllContent: builder.query({
      query: () => ({
        url: 'content',
        method: 'select',
        body: 'matric, name',
      }),
      providesTags: ['Content'],
    }),

    // Upsert Content by content_id (without subjects_id)
    upsertContentById: builder.mutation({
      query: ({ content_id, content, name }) => ({
        url: 'content',
        method: 'upsert',
        body: { content_id, note: content, name }, // No subjects_id included
        returning: 'representation',
      }),
      invalidatesTags: ['Content'],
    }),

    // Delete Content by content_id
    deleteContentById: builder.mutation({
      query: (content_id) => ({
        url: 'content',
        method: 'delete',
        body: { content_id },
      }),
      invalidatesTags: ['Content'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetContentByIdQuery,
  useUpsertContentByIdMutation,
  useDeleteContentByIdMutation,
  useGetAllContentQuery
} = contentAdminApi;

export default contentAdminApi;
