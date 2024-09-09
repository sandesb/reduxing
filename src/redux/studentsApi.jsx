import { createApi } from '@reduxjs/toolkit/query/react';
import supabase from '../config/supabaseClient';

// Base query for Supabase
const supabaseBaseQuery = async ({ url, method, body }) => {
  let supabaseQuery;
  switch (method) {
    case 'select':
      supabaseQuery = supabase.from(url).select(body);
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
      query: () => ({ url: 'students', method: 'select', body: '*' }), // Fetch all students from "users" table
      providesTags: ['Students'],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetStudentsQuery } = studentsApi;

export default studentsApi;
