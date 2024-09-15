// studentsApi.js

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
        supabaseQuery = supabase.from(url).delete().eq('id', params); // Use `params` to pass the ID
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

// Create studentsApi
export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: supabaseBaseQuery,
  tagTypes: ['Students'],
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => ({ url: 'students', method: 'select', body: '*' }),
      providesTags: ['Students'],
    }),
    getStudentById: builder.query({
      query: (id) => ({ url: 'students', method: 'select', body: '*', params: { id } }),
    }),
    addStudent: builder.mutation({
      query: (student) => ({
        url: 'students',
        method: 'insert',
        body: student,
      }),
      invalidatesTags: ['Students'],
    }),
    updateStudent: builder.mutation({
      query: ({ id, student }) => ({
        url: 'students',
        method: 'update',
        body: student,
        params: { id },
      }),
      invalidatesTags: ['Students'],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: 'students',
        method: 'delete',
        params: id, // Pass the student ID as a parameter for deletion
      }),
      invalidatesTags: ['Students'], // Invalidate the list to trigger a refetch after deleting
    }),
  }),
});

export const { useGetStudentsQuery, useAddStudentMutation, useGetStudentByIdQuery, useUpdateStudentMutation, useDeleteStudentMutation  } = studentsApi;
export default studentsApi;


