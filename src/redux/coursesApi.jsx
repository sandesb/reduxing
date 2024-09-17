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
        supabaseQuery = supabase.from(url).upsert(body).select();
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


const mergeCourseContent = (existingData, db_id, newNote) => {
  const updatedData = existingData ? { ...existingData } : {};
  
  // Ensure we are adding the new note in the right place
  updatedData[db_id] = {
    blocks: newNote.blocks,
    time: newNote.time,
    version: newNote.version,
  };

  return updatedData;
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

       
    // Load main content based on db_id
    loadContent: builder.query({
      query: (db_id) => ({
        url: `content?db_id=eq.${db_id}`,
        method: 'select',
        body: '*',
      }),
      providesTags: ['Courses'],
    }),


    // Load proposed content based on matricNo
    loadProposedContent: builder.query({
      query: ({ matricNo }) => ({
        url: `proposedcontent`,
        method: 'select',
        body: '*',
        filter: `matric=eq.${matricNo}`, // Fetch by matricNo
      }),
      providesTags: ['ProposedContent'],
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
 // Copy content from the main content table to the proposedcontent table for the first time
 submitProposedContent: builder.mutation({
  query: ({ matric, db_id, note }) => ({
    url: 'proposedcontent',
    method: 'upsert',
    body: {
      matric,
      course_data: { [db_id]: note }, // Store the note under the db_id key in course_data
    },
  }),
  invalidatesTags: ['ProposedContent'],
}),

// Update the proposed content (course_data) for a specific user
// Update proposed content mutation
updateProposedContent: builder.mutation({
  query: ({ matric, db_id, newNote }) => {
    return {
      url: 'proposedcontent',
      method: 'upsert',
      body: {
        matric,
        course_data: mergeCourseContent(matric.course_data, db_id, newNote), // Merge new note with existing course_data
        proposed_note: newNote,  // Ensure proposed_note is not null
      },
    };
  },
  invalidatesTags: ['ProposedContent'],
}),
// Mutation to upsert (insert or update) proposed content into the proposedcontent table
addProposedContent: builder.mutation({
  query: ({ proposed_id, s_id, matric, proposed_note, course_data }) => ({
    url: 'proposedcontent',
    method: 'upsert',  // Use upsert to insert new or update existing records
    body: {
      proposed_id,
      s_id,
      matric,
      proposed_note,
      course_data
    },
  }),
  invalidatesTags: ['ProposedContent'],
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
  useAddProposedContentMutation,  // Exporting the mutation


} = coursesApi;

export default coursesApi;