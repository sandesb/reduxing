import { createApi } from '@reduxjs/toolkit/query/react';
import supabase from '../config/supabaseClient';
import { showToast } from '../utils/toast';
import { v4 as uuidv4 } from 'uuid';

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
        supabaseQuery = supabase.from(url).upsert(body).eq('db_id', body.db_id).select();
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
  tagTypes: ['Courses', 'ProposedContent'],
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
        method: 'upsert',  // Use UPSERT to insert or update based on db_id
        body: { db_id, note: content, name },  // Pass db_id and the content (note)
        returning: 'representation', // Request to return the updated record
      }),
      invalidatesTags: ['Content'],
    }),

 // UPSERT content into proposedcontent table
 submitProposedContent: builder.mutation({
  query: ({ db_id, matric, proposed_note }) => ({
    url: 'proposedcontent',
    method: 'upsert',  // Use upsert
    body: {
      db_id,
      matric,  // Use the matricNo as a unique identifier
      proposed_note,  // The content proposed by the student or guest
      s_id: uuidv4()  // Generate a unique s_id if inserting a new record
    },
    returning: 'representation', // Request to return the updated record
  }),
  invalidatesTags: ['ProposedContent'],
}),

// Update existing proposed content or insert new one
updateProposedContent: builder.mutation({
  query: ({ db_id, matric, proposed_note }) => ({
    url: 'proposedcontent',
    method: 'upsert',  // Use UPSERT to insert or update based on db_id and matric
    body: {
      db_id,
      matric,  // Use the matricNo as a unique identifier
      proposed_note: proposed_note,  // Ensure valid JSON format for the proposed_note
    },
    returning: 'representation', // Request to return the updated record
  }),
  invalidatesTags: ['ProposedContent'],
  async onQueryStarted({ db_id, matric, proposed_note }, { dispatch, queryFulfilled }) {
    try {
      const response = await queryFulfilled;
      console.log('UPSERT Successful:', response);  // Log response to check if UPSERT was successful
    } catch (error) {
      console.error('Error during UPSERT:', error);  // Log error if UPSERT fails
    }
  },
}),

// Load proposed content based on db_id and matricNo
loadProposedContent: builder.query({
  query: ({ db_id, matricNo }) => ({
    url: `proposedcontent?db_id=eq.${db_id}&matric=eq.${matricNo}`, // Fetch content based on db_id and matricNo
    method: 'select',
    body: '*',
  }),
  providesTags: ['ProposedContent'],
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
  useSubmitProposedContentMutation,
  useUpdateProposedContentMutation,
  useLoadProposedContentQuery,

} = coursesApi;

export default coursesApi;
