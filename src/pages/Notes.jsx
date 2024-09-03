import React, { useEffect, useState, useRef } from 'react';
import Editor from '../components/Editor';
import { useParams, useLocation } from 'react-router-dom';
import { useLoadContentQuery } from '../redux/coursesApi';

const Notes = () => {
  const { id } = useParams();  // Get the db_id from the URL
  const location = useLocation();  // Get the location object to access the state
  const { data: loadedContent, isLoading, error } = useLoadContentQuery(id);  // Load content based on id
  const [data, setData] = useState(null);
  const hasInitialized = useRef(false);

  const itemName = location.state?.title || 'Unknown Item';  // Get the item name from the location state

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

  useEffect(() => {
    console.log('db_id:', id);  // Log the id to ensure it's available
  }, [id]);

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Study Notes for {itemName} (ID: {id})
      </h1>
      <div className="w-full text-left editorjs-container">
        <Editor
          data={data}
          editorBlock="editorjs-container"
          db_id={id}  // Pass the `id` to the Editor as `db_id`
          itemName={itemName}  // Pass the itemName to the Editor for the name field
        />
      </div>
    </div>
  );
};

export default Notes;
