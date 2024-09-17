import React, { useEffect, useRef, useCallback } from 'react';
import EditorJS from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './Tool';
import useSaveCourseContent from '../hooks/useSaveCourseContent';  // Import the new custom hook

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

const Editor = ({ data, editorBlock = 'editorjs', db_id, matricNo }) => {
  const editorInstance = useRef(null);
  const editorContainerRef = useRef(null); // Ref for the editor container div

  // Use the custom hook for saving course content
  const { saveCourseContent } = useSaveCourseContent();

  // Save content function for the proposedcontent table
  const handleSaveContent = useCallback(
    debounce(async (newData) => {
      if (!db_id || !matricNo || matricNo === 'guest') return;

      // Pass the updated note (newData) to be saved in the proposedcontent table
      saveCourseContent(matricNo, db_id, newData, data);  // Passing current course data
    }, 1000),
    [saveCourseContent, db_id, matricNo, data]
  );

  useEffect(() => {
    if (!editorInstance.current && editorContainerRef.current && data) {
      const editor = new EditorJS({
        holder: editorBlock,  // Referencing the correct holder ID
        data: data,
        tools: EDITOR_JS_TOOLS,
        onReady: () => {
          editorInstance.current = editor;
        },
        async onChange(api) {
          const newData = await api.saver.save();
          handleSaveContent(newData);  // Save changes
        },
      });
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [data, editorBlock, handleSaveContent]);

  return (
    <div id={editorBlock} ref={editorContainerRef} />  // Ensures ID and ref are correctly set
  );
};

export default Editor;
