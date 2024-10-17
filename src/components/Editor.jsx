import React, { useEffect, useRef, useCallback } from 'react';
import EditorJS from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './Tool';
import { useUpdateContentMutation } from '../redux/coursesApi';

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

const Editor = ({ data, editorBlock, db_id, itemName, setSaving, readOnly = false }) => {
  const editorInstance = useRef(null);
  const [updateContent] = useUpdateContentMutation();

  const saveContent = useCallback(
    debounce(async (newData) => {
      // Check matricNo directly from localStorage before saving
      const matricNo = localStorage.getItem('matricNo');
      console.log('Checking matricNo from localStorage before saving:', matricNo);

      if (!matricNo) {
        console.warn('Cannot save content. User is in guest mode (no matricNo found in localStorage).');
        setSaving('Cannot save in guest mode.');
        return;
      }

      if (!db_id) {
        console.error('db_id is undefined, cannot save content.');
        return;
      }

      setSaving('saving'); // Set status to "Saving..."

      try {
        const result = await updateContent({ db_id, content: newData, name: itemName }).unwrap();
        console.log('Content successfully saved to Supabase:', result);
        setSaving('saved'); // Set status to "Saved"
      } catch (saveError) {
        console.error('Error saving content to Supabase:', saveError);
      }
    }, 1000),
    [updateContent, db_id, itemName, setSaving]
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
