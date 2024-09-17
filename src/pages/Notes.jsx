import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useContentManagement from '../hooks/useContentManagement';  // For copying content if not present
import useFetchProposedContent from '../hooks/useFetchProposedContent';  // For displaying the content
import LoadingSpinner from '../components/LoadingSpinner';
import Editor from '../components/Editor';  // Import the Editor component

const Notes = () => {
  const { id } = useParams();  // This is the db_id from the URL (course id)
  const location = useLocation();
  const { matricNo } = useSelector((state) => state.user);  // Get matricNo from Redux

  const itemName = location.state?.title || 'Unknown Item';

  // Step 1: Use content management hook to copy data from content to proposedcontent if necessary
  const { isLoading: isCopying, data: copiedData } = useContentManagement({ db_id: id, matricNo });

  // Step 2: Use the fetch proposed content hook to get the actual data for the current db_id
  const { courseContent, isLoading: isFetching, error } = useFetchProposedContent({ db_id: id, matricNo });

  // Step 3: Handle loading states
  if (isCopying || isFetching) return <LoadingSpinner />;

  if (error) return <p className="text-red-500">Error loading content: {error.message}</p>;

  // Step 4: Pass the fetched content to EditorJS for rendering and editing
  return (
    <div className="p-6 font-lato">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Study Notes for {itemName}
      </h1>

      <div className="w-full text-left editorjs-container">
        {courseContent ? (
          <Editor
            data={courseContent}  // Pass the fetched course content to EditorJS
            editorBlock="editorjs-container"
            db_id={id}
            matricNo={matricNo}
          />
        ) : (
          <p className="text-center text-gray-500">No content available for this course.</p>
        )}
      </div>
    </div>
  );
};

export default Notes;
