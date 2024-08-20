import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import convex from '../convexClient';
const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '' }), // Base URL is not used since Convex client handles it
  endpoints: (builder) => ({
    fetchCourses: builder.query({
      queryFn: async () => {
        try {
          const courses = await convex.query('courses.getAll'); // Using Convex to fetch courses
          return { data: courses };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error } };
        }
      },
      providesTags: ['Courses'],
    }),
    createCourse: builder.mutation({
      queryFn: async (newCourse) => {
        try {
          await convex.mutation('courses.create', newCourse);
          return { data: newCourse };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error } };
        }
      },
      invalidatesTags: ['Courses'],
    }),
    updateCourse: builder.mutation({
      queryFn: async (updatedCourse) => {
        try {
          await convex.mutation('courses.update', updatedCourse);
          return { data: updatedCourse };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error } };
        }
      },
      invalidatesTags: ['Courses'],
    }),
    deleteCourse: builder.mutation({
      queryFn: async (id) => {
        try {
          await convex.mutation('courses.delete', id);
          return { data: id };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error } };
        }
      },
      invalidatesTags: ['Courses'],
    }),
  }),
});

export const {
  useFetchCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = coursesApi;

export default coursesApi;
