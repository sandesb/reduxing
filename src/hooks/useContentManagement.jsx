import { useEffect, useCallback, useState, useRef } from 'react';
import { useLoadContentQuery, useLoadProposedContentQuery, useUpdateProposedContentMutation, useSubmitProposedContentMutation } from '../redux/coursesApi';

const useContentManagement = ({ db_id, matricNo }) => {
  const [data, setData] = useState(null);
  const [isSaving, setIsSaving] = useState(null); // Track saving status
  const hasInitialized = useRef(false); // Prevent multiple initialization

  // Load main content and proposed content queries
  const { data: mainContent, isLoading: isLoadingMainContent, error: mainContentError } = useLoadContentQuery(db_id);
  const { data: proposedContent, isLoading: isLoadingProposed, error: proposedError } = useLoadProposedContentQuery({ db_id, matricNo });

  const [updateProposedContent] = useUpdateProposedContentMutation();
  const [submitProposedContent] = useSubmitProposedContentMutation();

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

  // Copy main content to proposedcontent for the first time
  const copyMainContentToProposed = useCallback(async () => {
    if (matricNo === 'guest') return; // No need to copy for guests

    try {
      if (mainContent?.length > 0 && mainContent[0]?.note) {
        const { note } = mainContent[0];
        // Create a unique copy for the user
        await submitProposedContent({
          db_id,
          matric: matricNo,
          proposed_note: note,  // Copy the main content's note
        }).unwrap();
      }
    } catch (error) {
      console.error('Error copying main content:', error);
    }
  }, [db_id, matricNo, mainContent, submitProposedContent]);

  // Effect to check and handle copying content on first load
  useEffect(() => {
    if (isLoadingMainContent || isLoadingProposed || mainContentError || proposedError || hasInitialized.current) return;

    if (proposedContent?.length > 0 && proposedContent[0]?.proposed_note) {
      // If user has a proposed copy, use that
      setData(proposedContent[0].proposed_note);
    } else {
      // If no copy exists, copy main content and use that
      if (mainContent?.length > 0 && mainContent[0]?.note) {
        setData(mainContent[0].note);
        copyMainContentToProposed();  // Copy content for future reference
      }
    }

    hasInitialized.current = true;
  }, [isLoadingMainContent, isLoadingProposed, mainContentError, proposedError, proposedContent, mainContent, copyMainContentToProposed]);

  return { data, isLoading: isLoadingMainContent || isLoadingProposed, isSaving };
};

export default useContentManagement;
