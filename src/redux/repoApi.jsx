import { createApi } from '@reduxjs/toolkit/query/react';
import supabase from '../config/supabaseClient';

// Base query for Supabase
const supabaseBaseQuery = async ({ url, method, body, params }) => {
  let supabaseQuery;
  switch (method) {
    case 'select':
      supabaseQuery = supabase.from(url).select(body);
      if (params?.id) {
        supabaseQuery = supabaseQuery.eq('id', params.id);
      }
      break;
    case 'insert':
      supabaseQuery = supabase.from(url).insert(body);
      break;
    case 'update':
      supabaseQuery = supabase.from(url).update(body).eq('id', params.id);
      break;
    case 'delete':
      supabaseQuery = supabase.from(url).delete().eq('id', params.id);
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

// Create repoApi
export const repoApi = createApi({
  reducerPath: 'repoApi',
  baseQuery: supabaseBaseQuery,
  tagTypes: ['Repositories'],
  endpoints: (builder) => ({
    getRepos: builder.query({
      query: () => ({ url: 'repositories', method: 'select', body: 'matric, id, title, source_name, image_url, abstract, project_report_url' }),
      providesTags: ['Repositories'],
    }),
    getRepoById: builder.query({
      query: (id) => ({ url: 'repositories', method: 'select', body: 'matric, title, abstract, source_name, image_url, project_source_code_url, project_report_url', params: { id } }),
      providesTags: ['Repositories'],
    }),
    addRepo: builder.mutation({
      query: (repo) => ({
        url: 'repositories',
        method: 'insert',
        body: repo,
      }),
      invalidatesTags: ['Repositories'],
    }),
  }),
});

export const { useGetReposQuery, useGetRepoByIdQuery, useAddRepoMutation } = repoApi;
export default repoApi;
