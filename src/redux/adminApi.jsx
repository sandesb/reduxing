// src/redux/adminApi.js
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

// Create adminApi
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: supabaseBaseQuery,
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    getAdminCredentials: builder.query({
      query: () => ({ url: 'admin', method: 'select', body: 'email, password' }), // Fetch admin credentials from the "admin" table
      providesTags: ['Admin'],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetAdminCredentialsQuery } = adminApi;

export default adminApi;
