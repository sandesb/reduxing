import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { showToast } from '../utils/toast';

const BASE_URL = 'http://localhost:3001/courses';

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Courses'],
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => '/',
      providesTags: ['Courses'],
    }),
    loadNote: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Courses', id }],
    }),
    

    updateNote: builder.mutation({
      query: ({ id, note }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: { note },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Courses', id }],
      async onQueryStarted({ id, note }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          showToast('success', 'Note updated successfully');
        } catch (error) {
          showToast('error', 'Failed to update note');
        }
      },
    }),
    
    
    addCourse: builder.mutation({
      query: (course) => ({
        url: '/',
        method: 'POST',
        body: course,
      }),
      invalidatesTags: ['Courses'],
      async onQueryStarted(course, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          coursesApi.util.updateQueryData('getCourses', undefined, (draft) => {
            draft.push(course); // Add the new course to the cache
          })
        );
        try {
          await queryFulfilled;
          showToast('success', 'Course added successfully');
        } catch (error) {
          patchResult.undo(); // Revert the optimistic update if the mutation fails
          showToast('error', 'Failed to add course');
        }
      },
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...course }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: course,
      }),
      invalidatesTags: ['Courses'],
      async onQueryStarted({ id, ...course }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          coursesApi.util.updateQueryData('getCourses', undefined, (draft) => {
            const index = draft.findIndex((c) => c.id === id);
            if (index !== -1) {
              draft[index] = { id, ...course }; // Update the course in the cache
            }
          })
        );
        try {
          await queryFulfilled;
          showToast('update', 'Course updated successfully');
        } catch (error) {
          patchResult.undo(); // Revert the optimistic update if the mutation fails
          showToast('error', 'Failed to update course');
        }
      },
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Courses'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          coursesApi.util.updateQueryData('getCourses', undefined, (draft) => {
            return draft.filter((course) => course.id !== id); // Remove the course from the cache
          })
        );
        try {
          await queryFulfilled;
          showToast('error', 'Course deleted.');
        } catch (error) {
          patchResult.undo(); // Revert the optimistic update if the mutation fails
          showToast('error', 'Failed to delete course');
        }
      },
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useUpdateNoteMutation,
  useLoadNoteQuery
} = coursesApi;

export default coursesApi;
