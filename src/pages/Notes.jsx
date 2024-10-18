import React, { useEffect, useState, useRef } from 'react';
import Editor from '../components/Editor';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParams, useLocation } from 'react-router-dom';
import { useLoadContentQuery } from '../redux/subjectsApi';

const Notes = () => {
  const { id } = useParams();  // This is the subjects_id from the URL
  const location = useLocation();
  const itemName = location.state?.title || 'Unknown Item';

  // Get matricNo from localStorage
  const matricNo = localStorage.getItem('matricNo');
  const isGuest = !matricNo; // If matricNo doesn't exist, the user is a guest

  // Fetch the content using subjects_id and either matricNo or NULL for guests
  const { data: loadedContent, isLoading, error } = useLoadContentQuery({ subjects_id: id, matric: matricNo });

  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(null); // State to track saving status ('saving', 'saved', null)
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    if (error) {
      console.error('Error loading content:', error);
      return;
    }

    if (hasInitialized.current) return;

    if (loadedContent && loadedContent.length > 0 && loadedContent[0].note && loadedContent[0].note.blocks.length > 0) {
      setData(loadedContent[0].note);  // Set the content data
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

      {/* If the user is not a guest, show "Saving..." or "Saved" messages */}
      {!isGuest && (
        <>
          {saving === 'saving' && <p className="text-center text-red-500">Saving...</p>}
          {saving === 'saved' && <p className="text-center text-green-500">Saved</p>}
        </>
      )}

      {/* If the user is a guest, show a "Cannot Save" message */}
      {isGuest && <p className="text-center text-red-500">You are in guest mode. Cannot Save.</p>}

      <div className="w-full text-left editorjs-container">
        <Editor
          data={data}
          editorBlock="editorjs-container"
          subjects_id={id}  // Pass subjects_id from the URL
          itemName={itemName}
          content_id={loadedContent?.[0]?.content_id}  // Pass the content_id from the loaded content
          setSaving={setSaving}
        />
      </div>
    </div>
  );
};

export default Notes;
