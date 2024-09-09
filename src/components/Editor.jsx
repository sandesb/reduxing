import React, { useEffect, useRef, useCallback, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './Tool';
import { useUpdateContentMutation } from '../redux/coursesApi';
import ImageUploader from './ImageUploader';  // Your working ImageUploader component
import DownloadButton from './DownloadButton';  // Import the DownloadButton component

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
  const [fileUrl, setFileUrl] = useState(null);  // Store the file URL uploaded from ImageUploader
  const [fileType, setFileType] = useState(null);  // Track if the file is an image or PDF
  const [publicId, setPublicId] = useState(null);  // Store public ID for the uploaded file
  const [fileExtension, setFileExtension] = useState(null);  // Store file extension (e.g., 'pdf')

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
    [updateContent, db_id, itemName, fileUrl]  // Include 'fileUrl' in the dependencies
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
        {/* Pass necessary props to ImageUploader */}
        <ImageUploader
          db_id={db_id}
          itemName={itemName}
          noteData={data}
          setFileUrl={setFileUrl}
          setFileType={setFileType}
          setPublicId={setPublicId}  // Set public ID after file upload
          setFileExtension={setFileExtension}  // Set file extension after upload
        />
      </div>

      {/* Conditional rendering for image or PDF */}
      {fileUrl && fileType === 'image' && (
        <img
          src={fileUrl}
          alt="Uploaded"
          className="w-50 rounded-md border-4 border-[#7F9CEA] shadow-lg"
        />
      )}

      {/* Dynamically render DownloadButton for PDFs */}
      {publicId && fileExtension && fileType === 'pdf' && (
        <DownloadButton publicId={publicId} fileExtension={fileExtension} />
      )}

      <div id={editorBlock} />
    </div>
  );
};

export default Editor;
