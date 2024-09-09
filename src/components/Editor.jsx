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

const Editor = ({ data, editorBlock, db_id, itemName }) => {
  const editorInstance = useRef(null);
  const [updateContent] = useUpdateContentMutation();

  // Debounced save function
  const saveContent = useCallback(
    debounce(async (newData) => {
      if (!db_id) {
        console.error('db_id is undefined, cannot save content.');
        return;
      }

      try {
        // Save content to Supabase
        const result = await updateContent({ db_id, content: newData, name: itemName }).unwrap();
        console.log('Content successfully saved to Supabase:', result);
      } catch (saveError) {
        console.error('Error saving content to Supabase:', saveError);
      }
    }, 1000),
    [updateContent, db_id, itemName]
  );

  // Initialize EditorJS
  useEffect(() => {
    if (!editorInstance.current && data) {
      const editor = new EditorJS({
        holder: editorBlock,
        data: data,
        tools: EDITOR_JS_TOOLS,  // Use ImageTool and AttachesTool
        onReady: () => {
          editorInstance.current = editor;
        },
        async onChange(api) {
          const newData = await api.saver.save();
          saveContent(newData);  // Trigger save to Supabase
        },
      });
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [data, editorBlock, saveContent]);

  return <div id={editorBlock} />;
};

export default Editor;
