import { createApi } from '@reduxjs/toolkit/query/react';
import supabase from '../config/supabaseClient';
import { showToast } from '../utils/toast';

const supabaseBaseQuery = async ({ url, method, body , returning}) => {
  let supabaseQuery;
  switch (method) {
    case 'select':
      supabaseQuery = supabase.from(url).select(body);
      break;
    case 'insert':
      supabaseQuery = supabase.from(url).insert(body);
      break;
    case 'update':
      console.log(body)
      supabaseQuery = supabase.from(url).update(body).eq('id', body.id);
      break;
      case 'update':  // Handle POST with UPSERT
      supabaseQuery = supabase.from(url).update(body).select(); // Ensure to return the inserted/updated row(s)
      break;
    case 'delete':
      supabaseQuery = supabase.from(url).delete().eq('id', body.id);
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


export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: supabaseBaseQuery,
  tagTypes: ['Courses'],
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => ({ url: 'db', method: 'select', body: '*' }),
      providesTags: ['Courses'],
    }),

    addCourse: builder.mutation({
      query: (course) => ({
        url: 'db',
        method: 'insert',
        body: course,
      }),
      invalidatesTags: ['Courses'],
      async onQueryStarted(course, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          coursesApi.util.updateQueryData('getCourses', undefined, (draft) => {
            draft.push(course);
          })
        );
        try {
          await queryFulfilled;
          showToast('success', 'Course added successfully');
        } catch (error) {
          patchResult.undo();
          showToast('error', 'Failed to add course');
        } finally {
          dispatch(coursesApi.util.invalidateTags(['Courses'])); // Refetch courses
        }
      },
    }),

    updateCourse: builder.mutation({
      query: ({ id, ...course }) => ({
        url: 'db',
        method: 'update',
        body: { id, ...course },
      }),
      invalidatesTags: ['Courses'],
      async onQueryStarted({ id, ...course }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          coursesApi.util.updateQueryData('getCourses', undefined, (draft) => {
            const index = draft.findIndex((c) => c.id === id);
            if (index !== -1) {
              draft[index] = { id, ...course };
            }
          })
        );
        try {
          await queryFulfilled;
          showToast('update', 'Course updated successfully');
        } catch (error) {
          patchResult.undo();
          showToast('error', 'Failed to update course');
        } finally {
          dispatch(coursesApi.util.invalidateTags(['Courses'])); // Refetch courses
        }
      },
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: 'db',
        method: 'delete',
        body: { id },  // Supabase expects the body for delete to contain the id
      }),
      invalidatesTags: ['Courses'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          coursesApi.util.updateQueryData('getCourses', undefined, (draft) => {
            return draft.filter((course) => course.id !== id);
          })
        );
        try {
          await queryFulfilled;
          showToast('success', 'Course deleted successfully');
        } catch (error) {
          patchResult.undo();
          showToast('error', 'Failed to delete course');
        } finally {
          dispatch(coursesApi.util.invalidateTags(['Courses'])); // Refetch courses
        }
      },
    }),

    loadNote: builder.query({
      query: (id) => ({
        url: `db?id=eq.${id}`,
        method: 'select',
        body: '*',
      }),
      providesTags: ['Courses'],
    }),

    updateNote: builder.mutation({
      query: ({ id, note }) => ({
        url: 'db',
        method: 'update',
        body: { id, note },
      }),
      invalidatesTags: ['Courses'],
    }),

       
    loadContent: builder.query({
      query: (db_id) => ({
        url: `content?db_id=eq.${db_id}`, // Fetch content based on db_id
        method: 'select',
        body: '*',
      }),
      providesTags: ['Courses'],
    }),

    updateContent: builder.mutation({
      query: ({ db_id, content, name }) => ({
        url: `content`,  // Target the `content` table directly
        method: 'update',  // Use POST with UPSERT
        body: { db_id, note: content, name },  // Ensure note is a JSON object
        returning: 'representation', // Explicitly request the return of the inserted/updated record(s)
      }),
      invalidatesTags: ['Content'],
    }),


    
  }),

  
});


export const {
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useUpdateNoteMutation,
  useLoadNoteQuery,
  useLoadContentQuery,
  useUpdateContentMutation
} = coursesApi;

export default coursesApi;
