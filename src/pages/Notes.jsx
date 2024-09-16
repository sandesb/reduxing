import React, { useEffect, useState, useRef } from 'react';
import Editor from '../components/Editor';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParams, useLocation } from 'react-router-dom';
import { useLoadContentQuery } from '../redux/coursesApi';

const Notes = () => {
  const { id } = useParams();  // This is the db_id from the URL
  const location = useLocation();
  const { data: loadedContent, isLoading, error } = useLoadContentQuery(id);  // Use db_id to load content
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(null); // State to track saving status ('saving', 'saved', null)
  const hasInitialized = useRef(false);

  const itemName = location.state?.title || 'Unknown Item';

  useEffect(() => {
    if (isLoading) return;

    if (error) {
      console.error('Error loading content:', error);
      return;
    }

    if (hasInitialized.current) return;

    if (loadedContent && loadedContent.length > 0 && loadedContent[0].note && loadedContent[0].note.blocks.length > 0) {
      setData(loadedContent[0].note);
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
  }, [loadedContent, isLoading, error]);

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
  if (isLoading || !data) return <LoadingSpinner />;

  return (
    <div className="p-6 font-lato ">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Study Notes for {itemName}
      </h1>

      {/* Show "Saving..." or "Saved" messages */}
      {saving === 'saving' && <p className="text-center text-red-500">Saving...</p>}
      {saving === 'saved' && <p className="text-center text-green-500">Saved</p>}

      <div className="w-full text-left editorjs-container">
        <Editor
          data={data}
          editorBlock="editorjs-container"
          db_id={id}  // db_id is now passed here
          itemName={itemName}
          setSaving={setSaving} // Pass the setSaving function to Editor
        />
      </div>
    </div>
  );
};

export default Notes;
