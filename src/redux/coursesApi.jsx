import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
        } catch {
          patchResult.undo(); // Revert the optimistic update if the mutation fails
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
        } catch {
          patchResult.undo(); // Revert the optimistic update if the mutation fails
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
        } catch {
          patchResult.undo(); // Revert the optimistic update if the mutation fails
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
} = coursesApi;

export default coursesApi;
