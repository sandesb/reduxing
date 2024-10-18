import React, { useEffect, useRef, useCallback } from 'react';
import EditorJS from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './Tool';
import { useUpdateContentMutation } from '../redux/subjectsApi';

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

const Editor = ({ data, editorBlock, subjects_id, content_id, itemName, setSaving, readOnly = false }) => {
  const editorInstance = useRef(null);
  const [updateContent] = useUpdateContentMutation();

  const saveContent = useCallback(
    debounce(async (newData) => {
      const matricNo = localStorage.getItem('matricNo');  // Ensure matricNo is retrieved from localStorage
      console.log('Checking matricNo from localStorage before saving:', matricNo);
  
      if (!matricNo) {
        console.warn('Cannot save content. User is in guest mode (no matricNo found in localStorage).');
        setSaving('Cannot save in guest mode.');
        return;
      }
  
      if (!subjects_id || !content_id) {
        console.error('subjects_id or content_id is undefined, cannot save content.');
        return;
      }
  
      setSaving('saving'); // Set status to "Saving..."
  
      try {
        // Use UPSERT to update or insert the row based on content_id and matric
        const result = await updateContent({
          content_id,  // Use content_id to identify the row
          subjects_id,  // Ensure subjects_id is passed correctly
          matric: matricNo,  // Use matric to target the correct student
          content: newData,  // Pass the updated content
          name: itemName,
        }).unwrap();
  
        console.log('Content successfully saved to Supabase:', result);
        setSaving('saved'); // Set status to "Saved"
      } catch (saveError) {
        console.error('Error saving content to Supabase:', saveError);
      }
    }, 1000),
    [updateContent, subjects_id, content_id, itemName, setSaving]
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
