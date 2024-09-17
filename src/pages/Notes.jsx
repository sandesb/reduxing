import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Editor from '../components/Editor';
import LoadingSpinner from '../components/LoadingSpinner';
import useContentManagement from '../hooks/useContentManagement';
const Notes = () => {
  const { id } = useParams();  // This is the db_id from the URL
  const location = useLocation();
  const { matricNo, name } = useSelector((state) => state.user);  // Get matricNo from Redux

  const itemName = location.state?.title || 'Unknown Item';

  // Use the custom hook for content management logic
  const { data, isLoading, isSaving } = useContentManagement({ db_id: id, matricNo });

  // Loading or No data
  if (isLoading || !data) return <LoadingSpinner />;

  return (
    <div className="p-6 font-lato">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Study Notes for {itemName}
      </h1>

      {/* Show "Saving..." or "Saved" messages */}
      {isSaving === 'saving' && <p className="text-center text-red-500">Saving...</p>}
      {isSaving === 'saved' && <p className="text-center text-green-500">Saved</p>}

      <div className="w-full text-left editorjs-container">
        <Editor
          data={data}
          editorBlock="editorjs-container"
          db_id={id}
          matricNo={matricNo}
        />
      </div>
    </div>
  );
};

export default Notes;
