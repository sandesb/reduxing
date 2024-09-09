import React, { useEffect, useRef, useCallback, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './Tool';
import { useUpdateContentMutation } from '../redux/coursesApi';
import ImageUploader from './ImageUploader';  // Import your working ImageUploader component
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
  const [updateContent, { isLoading, isSuccess, isError, error }] = useUpdateContentMutation();
  const [imageUrl, setImageUrl] = useState(null);  // Store the image URL uploaded from ImageUploader

  // Debounced save function
  const saveContent = useCallback(
    debounce(async (newData) => {
      if (!db_id) {
        console.error('db_id is undefined, cannot save content.');
        return;
      }

      try {
        const result = await updateContent({ db_id, content: newData, name: itemName }).unwrap();
        console.log('Content successfully saved to Supabase:', result);
      } catch (saveError) {
        console.error('Error saving content to Supabase:', saveError);
      }
    }, 1000),
    [updateContent, db_id, itemName, imageUrl]  // Include 'imageUrl' in the dependencies
  );

  // Initialize EditorJS
  useEffect(() => {
    if (!editorInstance.current && data) {
      const editor = new EditorJS({
        holder: editorBlock,
        data: data,
        tools: { ...EDITOR_JS_TOOLS },
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

  return (
    <div>
      {/* Render the EditorJS instance */}
      <div className='flex justify-center items-center mb-6'>
      <ImageUploader db_id={db_id} itemName={itemName} noteData={data}  />
      </div>
      {imageUrl && <img src={imageUrl} 
      alt="Uploaded" 
            className="w-50 rounded-md border-4 border-[#7F9CEA] shadow-lg"
      
      />}

      <div id={editorBlock} />

      {/* Pass necessary props to ImageUploader */}

      {/* Display uploaded image */}
    </div>
  );
};

export default Editor;
