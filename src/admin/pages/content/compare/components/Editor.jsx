import React, { useEffect, useRef, useCallback } from 'react';
import EditorJS from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './Tool';
import { useUpsertContentByIdMutation } from '../../../../../redux/contentAdminApi'; // Use the new contentAdminApi mutation

// Debounce function to limit how often the save function is called
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const Editor = ({ data, editorBlock, content_id, itemName, setSaving, readOnly = false }) => {
  const editorInstance = useRef(null);
  const [upsertContent] = useUpsertContentByIdMutation(); // Use the new upsertContentById mutation

  // Log the received content_id for debugging
  console.log('content_id:', content_id); // Log content_id

  // Save content function with logging
  const saveContent = useCallback(
    debounce(async (newData) => {
      // Check if content_id is missing
      if (!content_id) {
        console.error('content_id is undefined, cannot save content.');
        return;
      }

      console.log('Saving content data:', newData); // Log the data being saved

      setSaving('saving'); // Set status to "Saving..."

      try {
        // Use upsert to update the row based on content_id
        const result = await upsertContent({
          content_id, // Use the content_id passed to this component
          content: newData, // Pass the updated content
          name: itemName, // Pass the name to be updated
        }).unwrap();

        console.log('Content successfully saved to Supabase:', result); // Log the response
        setSaving('saved'); // Set status to "Saved"
      } catch (saveError) {
        console.error('Error saving content to Supabase:', saveError); // Log the error
      }
    }, 1000),
    [upsertContent, content_id, itemName, setSaving]
  );

  useEffect(() => {
    if (!editorInstance.current && data) {
      const editor = new EditorJS({
        holder: editorBlock,
        data: data,
        tools: EDITOR_JS_TOOLS,
        readOnly: readOnly, // Pass the readOnly state

        onReady: () => {
          editorInstance.current = editor;
        },
        async onChange(api) {
          if (!readOnly) {
            const newData = await api.saver.save();
            console.log('Editor content has changed:', newData); // Log the editor content change
            saveContent(newData); // Trigger save to Supabase if allowed
          }
        },
      });
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [data, editorBlock, saveContent, readOnly]);

  return (
    <div>
      <div id={editorBlock} />
    </div>
  );
};

export default Editor;
