import React, { useEffect, useState, useRef } from 'react';
import Editor from '../components/Editor';
import { useParams, useLocation } from 'react-router-dom';
import { useLoadContentQuery } from '../redux/coursesApi';

const Notes = () => {
  const { id } = useParams();  // This is the db_id from the URL
  const location = useLocation();
  const { data: loadedContent, isLoading, error } = useLoadContentQuery(id);  // Use db_id to load content
  const [data, setData] = useState(null);
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

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="p-6 font-lato ">
      <h1 className="text-2xl font-bold mb-4">
        Study Notes for {itemName}
      </h1>
      <div className="w-full text-left editorjs-container">
        <Editor
          data={data}
          editorBlock="editorjs-container"
          db_id={id}  // db_id is now passed here
          itemName={itemName}
        />
      </div>
    </div>
  );
};

export default Notes;
