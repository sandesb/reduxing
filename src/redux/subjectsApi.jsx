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
        if (!body.id) {
          return { error: { status: 'CUSTOM_ERROR', data: 'ID is required for update' } };
        }
        supabaseQuery = supabase.from(url).update(body).eq('id', body.id).select(); // Ensure id is used
        break;

      case 'upsert': // If you need to use UPSERT
        supabaseQuery = supabase.from(url).upsert(body).eq('subjects_id', body.subjects_id).select();
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


export const subjectsApi = createApi({
  reducerPath: 'subjectsApi',
  baseQuery: supabaseBaseQuery,
  tagTypes: ['Courses'],
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => ({ url: 'subjects', method: 'select', body: '*' }),
      providesTags: ['Courses'],
    }),

    addCourse: builder.mutation({
      query: (course) => ({
        url: 'subjects',
        method: 'insert',
        body: course,
      }),
      invalidatesTags: ['Courses'],
      async onQueryStarted(course, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          subjectsApi.util.updateQueryData('getCourses', undefined, (draft) => {
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
          dispatch(subjectsApi.util.invalidateTags(['Courses'])); // Refetch courses
        }
      },
    }),

    updateCourse: builder.mutation({
      query: ({ id, ...course }) => ({
        url: 'subjects',
        method: 'update',
        body: { id, ...course },
      }),
      invalidatesTags: ['Courses'],
      async onQueryStarted({ id, ...course }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          subjectsApi.util.updateQueryData('getCourses', undefined, (draft) => {
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
          dispatch(subjectsApi.util.invalidateTags(['Courses'])); // Refetch courses
        }
      },
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: 'subjects',
        method: 'delete',
        body: { id },  // Supabase expects the body for delete to contain the id
      }),
      invalidatesTags: ['Courses'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          subjectsApi.util.updateQueryData('getCourses', undefined, (draft) => {
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
          dispatch(subjectsApi.util.invalidateTags(['Courses'])); // Refetch courses
        }
      },
    }),

    loadNote: builder.query({
      query: (id) => ({
        url: `subjects?id=eq.${id}`,
        method: 'select',
        body: '*',
      }),
      providesTags: ['Courses'],
    }),

    updateNote: builder.mutation({
      query: ({ id, note }) => ({
        url: 'subjects',
        method: 'update',
        body: { id, note },
      }),
      invalidatesTags: ['Courses'],
    }),

       
    loadContent: builder.query({
      query: ({ subjects_id, matric }) => {
        // If matric is not found (guest mode), fetch where matric is NULL
        const matricFilter = matric ? `&matric=eq.${matric}` : `&matric=is.null`;
    
        return {
          url: `content?subjects_id=eq.${subjects_id}${matricFilter}`,  // Fetch based on subjects_id and either matricNo or NULL
          method: 'select',
          body: '*',
        };
      },
      providesTags: ['Courses'],
    }),
    
    

    updateContent: builder.mutation({
      query: ({ content_id, subjects_id, matric, content, name }) => ({
        url: 'content',
        method: 'upsert',  // Use UPSERT to either insert or update
        body: { content_id, subjects_id, matric, note: content, name },  // Ensure content_id, subjects_id, and matric are passed
        returning: 'representation',  // Return the updated or inserted row
      }),
      invalidatesTags: ['Content'],  // Invalidate the cache to refetch content
    }),
    
    
    
    
    

    // Add this mutation to your existing subjectsApi in the `endpoints` section
addContentCopy: builder.mutation({
  query: (newContent) => ({
    url: 'content',
    method: 'insert',
    body: newContent, // Pass the new content object (subject_id, matric_no, note, etc.)
  }),
  invalidatesTags: ['Content'], // Invalidate the cache to reflect new changes
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
  useUpdateContentMutation,
  useAddContentCopyMutation
} = subjectsApi;

export default subjectsApi;