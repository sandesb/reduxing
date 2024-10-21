import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import supabase from '../config/supabaseClient';

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getMessages: builder.query({
      async queryFn() {
        const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (error) return { error };
        return { data };
      },
    }),
    addMessage: builder.mutation({
      async queryFn(newMessage) {
        const { data, error } = await supabase.from('messages').insert([newMessage]);
        if (error) return { error };
        return { data };
      },
    }),
    deleteMessage: builder.mutation({
      async queryFn(messageId) {
        const { data, error } = await supabase.from('messages').delete().eq('message_id', messageId);
        if (error) return { error };
        return { data };
      },
      // Optimistic update for delete
      async onQueryStarted(messageId, { dispatch, queryFulfilled }) {
        // Optimistically remove the message from the cache
        const patchResult = dispatch(
          messagesApi.util.updateQueryData('getMessages', undefined, (draft) => {
            return draft.filter(message => message.message_id !== messageId); // Remove the message from UI
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // Rollback in case of failure
        }
      },
    }),
  }),
});

export const { useGetMessagesQuery, useAddMessageMutation, useDeleteMessageMutation } = messagesApi;
export default messagesApi;
