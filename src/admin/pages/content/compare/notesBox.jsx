import React, { useEffect, useState, useRef } from 'react';
import Editor from './components/Editor';
import { useSearchParams, useLocation } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import { useGetContentQuery } from '../../../../redux/subjectsApi'; // Update with your correct path

const NotesBox = () => {
  const [searchParams] = useSearchParams();
  const content_id = searchParams.get('content_id'); // Extract content_id from URL
  let matric = searchParams.get('matric'); // Extract matric from URL

  // Treat "null" string as an actual null
  if (matric === "null") {
    matric = null;
  }

  const location = useLocation();
  const itemName = location.state?.title || 'Unknown Item';

  console.log("content_id:", content_id);
  console.log("matric:", matric);

  // Fetch content details (including note) using useGetContentQuery
  const { data: contentData, error: contentError, isLoading: isLoadingContent } = useGetContentQuery({
    content_id,
    matric: matric || null, // Pass matric if available, otherwise pass null
  });

  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(null); // State to track saving status ('saving', 'saved', null)
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isLoadingContent) return;

    if (contentError) {
      console.error('Error loading content:', contentError);
      return;
    }

    if (hasInitialized.current) return;

    // Map the content_id with its respective null matric and show unique note data
    const matchingContentItem = contentData?.find(
      (item) => item.content_id === content_id && item.matric === matric
    );

    if (matchingContentItem && matchingContentItem.note && matchingContentItem.note.blocks.length > 0) {
      setData(matchingContentItem.note); // Set the content data for this content_id and null matric
    } else {
      setData({
        time: new Date().getTime(),
        blocks: [
          {
            type: "header",
            data: {
              text: "Write anything here...",
              level: 1
            }
          }
        ]
      });
    }

    hasInitialized.current = true;
  }, [contentData, content_id, matric, isLoadingContent, contentError]);

  // Show "Saved" for 3 seconds after saving is complete
  useEffect(() => {
    if (saving === 'saved') {
      const timer = setTimeout(() => {
        setSaving(null); // Clear the saving state after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Clear timeout if component unmounts
    }
  }, [saving]);

  // Use LoadingSpinner while loading
  if (isLoadingContent || !data) return <LoadingSpinner />;

  return (
    <div className="p-6 font-lato">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Study NotesBox for {itemName}
      </h1>

      {/* Show "Saving..." or "Saved" messages */}
      {saving === 'saving' && <p className="text-center text-red-500">Saving...</p>}
      {saving === 'saved' && <p className="text-center text-green-500">Saved</p>}

      <div className="w-full text-left editorjs-container">
        <Editor
          data={data}
          editorBlock="editorjs-container"
          content_id={content_id} // Pass content_id instead of subjects_id
          itemName={itemName}
          setSaving={setSaving}
        />
      </div>
    </div>
  );
};

export default NotesBox;
