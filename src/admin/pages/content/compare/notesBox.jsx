import React, { useEffect, useState } from 'react';
import Editor from './components/Editor';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import { useGetContentQuery } from '../../../../redux/subjectsApi'; // Adjust this to your correct path

const NotesBox = () => {
  const [searchParams] = useSearchParams();
  const content_id = searchParams.get('content_id'); // Extract content_id from URL
  let matric = searchParams.get('matric'); // Extract matric from URL

  // Treat "null" string as an actual null
  if (matric === "null") {
    matric = null;
  }

  const [compareData, setCompareData] = useState(null); // State for storing comparison data
  const [showCompareEditor, setShowCompareEditor] = useState(false); // State to toggle compare editor
  const [saving, setSaving] = useState(null); // State to track saving status ('saving', 'saved', null)

  console.log('content_id from URL:', content_id); // Log content_id for debugging

  // Fetch content details (including note) using useGetContentQuery
  const { data: contentData, error: contentError, isLoading: isLoadingContent } = useGetContentQuery({
    content_id,
  });

  const [data, setData] = useState(null);
  const [itemName, setItemName] = useState('Unknown Item');
  
  useEffect(() => {
    if (isLoadingContent) return;

    if (contentError) {
      console.error('Error loading content:', contentError);
      return;
    }

    console.log('Full content data received from query:', contentData);

    const matchingContentItem = contentData?.find(
      (item) => item.content_id === content_id && item.matric === matric
    );

    if (matchingContentItem) {
      setData(matchingContentItem.note); // Set the content data
      setItemName(matchingContentItem.name || 'Unknown Item'); // Set the content name
    }

    console.log('Fetched content:', matchingContentItem); // Log the fetched content
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

  // Handle the "Compare Notes" button click for comparing with `NULL` matric
  const handleCompareNotes = () => {
    console.log('Comparing notes for:', itemName);
  
    if (!contentData) {
      console.error('Content data is missing!');
      return;
    }
  
    console.log('Full content data received from Supabase:', contentData);
  
    // Find the content with the same name but where the matric is `null`
    const nullMatricContent = contentData.find(
      (item) => item.name === itemName && item.matric === null // Check for null matric
    );
  
    // Check if we found matching content
    if (nullMatricContent) {
      console.log('Found matching content with "null" matric:', nullMatricContent);
      setCompareData({
        note: nullMatricContent.note,
        content_id: nullMatricContent.content_id,
      }); // Store both note and content_id
      setShowCompareEditor(true); // Show the comparison editor
    } else {
      console.log(`No matching content found with "null" matric for ${itemName}.`);
    }
  };
  

  // Use LoadingSpinner while loading
  if (isLoadingContent || !data) return <LoadingSpinner />;

  return (
    <div className="p-6 font-lato">
      <h1 className="text-2xl font-bold mb-4 text-center w-full">
        Study NotesBox for {itemName}
      </h1>

      {/* Show "Saving..." or "Saved" messages */}
      {saving === 'saving' && <p className="text-center text-red-500">Saving...</p>}
      {saving === 'saved' && <p className="text-center text-green-500">Saved</p>}

      {/* Compare Notes Button */}
      <div className="text-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleCompareNotes}
        >
          Compare Notes
        </button>
      </div>

      {/* Wrapping the two editors in a flex container */}
      <div className="editor-wrapper flex flex-row space-x-4">
        <div className="editor-container w-1/2">
          <Editor
            data={data}
            editorBlock="editorjs-container-1"
            content_id={content_id}
            itemName={itemName}
            setSaving={setSaving}
          />
        </div>

        {/* Conditionally render the compare editor when the button is clicked */}
    {/* Conditionally render the compare editor when the button is clicked */}
{showCompareEditor && compareData && (
  <div className="editor-container w-1/2">
    <Editor
      data={compareData.note} // Pass the note data
      editorBlock="editorjs-container-2"
      content_id={compareData.content_id} // Pass the correct content_id
      itemName={`${itemName}`}
      setSaving={setSaving} // If you want to enable saving
      readOnly={false} // Set to false to allow editing and saving
    />
  </div>
)}


        {/* Log the state of compareData and showCompareEditor for debugging */}
        {console.log('Compare Data:', compareData)}
        {console.log('Show Compare Editor:', showCompareEditor)}
      </div>
    </div>
  );
};

export default NotesBox;
