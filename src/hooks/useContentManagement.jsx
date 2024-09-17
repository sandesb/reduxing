import { useEffect, useCallback, useState } from 'react';
import { useLoadContentQuery, useLoadProposedContentQuery, useUpdateProposedContentMutation } from '../redux/coursesApi';
import { useRef } from 'react';
const useContentManagement = ({ db_id, matricNo }) => {
  const [data, setData] = useState(null);
  const [isSaving, setIsSaving] = useState(null); // Track saving status
  const hasInitialized = useRef(false); // Prevent multiple initialization

  const { data: loadedContent, isLoading: isLoadingContent, error: contentError } = useLoadContentQuery(db_id);
  const { data: proposedContent, isLoading: isLoadingProposed, error: proposedError } = useLoadProposedContentQuery({ db_id, matricNo });
  const [updateProposedContent] = useUpdateProposedContentMutation();

  // Save content to proposedcontent table
  const saveContent = useCallback(
    async (newData) => {
      if (!db_id || !matricNo || matricNo === 'guest') return; // Avoid saving for guests
      setIsSaving('saving');
      try {
        await updateProposedContent({ db_id, matric: matricNo, proposed_note: newData }).unwrap();
        setIsSaving('saved');
      } catch (error) {
        console.error('Error saving proposed content:', error);
      }
    },
    [db_id, matricNo, updateProposedContent]
  );

  useEffect(() => {
    // Exit early if loading or errors
    if (isLoadingContent || contentError || proposedError || hasInitialized.current) return;

    if (matricNo === 'guest') {
      // For guests, just load the main content without any saving
      if (loadedContent && loadedContent.length > 0 && loadedContent[0].note) {
        setData(loadedContent[0].note);
      }
    } else {
      // For regular users with matricNo, load or copy content to proposedcontent
      if (proposedContent?.length > 0 && proposedContent[0].proposed_note) {
        setData(proposedContent[0].proposed_note);
      } else if (loadedContent?.length > 0 && loadedContent[0].note) {
        // If no proposed content exists, copy main content to proposedcontent
        setData(loadedContent[0].note);
        saveContent(loadedContent[0].note); // Copy main content to proposedcontent table
      }
    }

    hasInitialized.current = true;
  }, [isLoadingContent, contentError, proposedError, loadedContent, proposedContent, saveContent, matricNo]);

  return { data, isLoading: isLoadingContent || isLoadingProposed, isSaving };
};

export default useContentManagement;
