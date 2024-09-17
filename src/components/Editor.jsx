import React, { useEffect, useRef, useCallback } from 'react';
import EditorJS from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './Tool';
import { useUpdateProposedContentMutation } from '../redux/coursesApi'; 

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

const Editor = ({ data, editorBlock, db_id, matricNo }) => {
  const editorInstance = useRef(null);
  const [updateProposedContent] = useUpdateProposedContentMutation(); 

  // Save content function for the proposedcontent table
  const saveContent = useCallback(
    debounce(async (newData) => {
      if (!db_id || !matricNo || matricNo === 'guest') return; 

      try {
        await updateProposedContent({ db_id, matric: matricNo, proposed_note: newData }).unwrap();
        console.log('Content saved successfully');
      } catch (saveError) {
        console.error('Error saving proposed content:', saveError);
      }
    }, 1000),
    [updateProposedContent, db_id, matricNo]
  );

  useEffect(() => {
    if (!editorInstance.current && data) {
      const editor = new EditorJS({
        holder: editorBlock,
        data: data,
        tools: EDITOR_JS_TOOLS,
        onReady: () => {
          editorInstance.current = editor;
        },
        async onChange(api) {
          const newData = await api.saver.save();
          saveContent(newData); // Save to proposedcontent
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
