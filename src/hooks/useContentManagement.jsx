import { useEffect, useCallback, useState, useRef } from 'react';
import { useLoadContentQuery, useLoadProposedContentQuery, useAddProposedContentMutation } from '../redux/coursesApi';  // Add useLoadProposedContentQuery to check existing content
import { v4 as uuidv4 } from 'uuid';

const useContentManagement = ({ db_id, matricNo }) => {
  const [data, setData] = useState(null);
  const hasInitialized = useRef(false);  // Prevent multiple initializations

  // Load main content query (notes from 'content' table)
  const { data: mainContent, isLoading: isLoadingMainContent, error: mainContentError } = useLoadContentQuery(db_id);
  
  // Load proposed content to check for existing records for this student (by matricNo and s_id)
  const { data: proposedContent, isLoading: isLoadingProposed } = useLoadProposedContentQuery({ matricNo });

  // Mutation to add or update proposed content in the database
  const [addProposedContent] = useAddProposedContentMutation();  

  // Generate IDs for the proposed content
  const generateProposedContent = useCallback(() => {
    const proposed_id = uuidv4();  // Generate a UUID for proposed_id
    const s_id = uuidv4();  // Generate a UUID for s_id

    console.log("Generated IDs:");
    console.log("proposed_id:", proposed_id);
    console.log("s_id:", s_id);

    return { proposed_id, s_id };
  }, []);

  // Merge new course data into existing course_data for the same student and session (s_id)
  const mergeCourseData = useCallback((existingCourseData, db_id, note) => {
    return {
      ...existingCourseData,
      [db_id]: note  // Add or overwrite the content for this db_id
    };
  }, []);

  // Copy content to 'proposedcontent' structure and store or update in Supabase
  const copyMainContentToProposed = useCallback(async () => {
    if (!matricNo || matricNo === 'guest') return;  // Avoid saving for guests

    // Check if main content exists
    if (mainContent?.length > 0 && mainContent[0]?.note) {
      const { note } = mainContent[0];
      console.log("Main content note:", note);

      // Generate the UUIDs (used for new entries)
      const { proposed_id, s_id } = generateProposedContent();

      let course_data;
      let s_id_to_use = s_id;  // Use the new s_id by default

      // Check if the matric already exists in the proposedcontent table
      if (proposedContent?.length > 0) {
        const existingProposedContent = proposedContent.find((entry) => entry.matric === matricNo);

        if (existingProposedContent) {
          console.log("Existing proposed content found:", existingProposedContent);
          // Use existing s_id if found
          s_id_to_use = existingProposedContent.s_id;

          // Merge the new course content into the existing course_data
          course_data = mergeCourseData(existingProposedContent.course_data, db_id, note);
        } else {
          console.log("No existing content found for this matric, creating new entry.");
          course_data = { [db_id]: note };  // New course_data with just this db_id
        }
      } else {
        console.log("No existing proposed content found, creating new record.");
        course_data = { [db_id]: note };  // New course_data with just this db_id
      }

      // Structure for proposedcontent
      const proposedContentData = {
        proposed_id,
        s_id: s_id_to_use,  // Either the new or existing s_id
        matric: matricNo,
        proposed_note: note,  // Copying main content into 'proposed_note'
        course_data  // Merged or new course_data
      };

      // Store or update proposed content in Supabase
      try {
        const response = await addProposedContent(proposedContentData).unwrap();
        console.log("Proposed content successfully stored:", response);
      } catch (error) {
        console.error("Error storing proposed content:", error);
      }
    } else {
      console.warn("No main content found to copy.");
    }
  }, [db_id, matricNo, mainContent, proposedContent, addProposedContent, generateProposedContent, mergeCourseData]);

  // Effect to check and handle copying content on first load
  useEffect(() => {
    if (isLoadingMainContent || isLoadingProposed || mainContentError || hasInitialized.current) return;

    // Copy the main content on the first load
    if (mainContent?.length > 0 && mainContent[0]?.note) {
      setData(mainContent[0].note);  // Set the current note
      copyMainContentToProposed();  // Copy content to 'proposedcontent'
    }

    hasInitialized.current = true;
  }, [isLoadingMainContent, isLoadingProposed, mainContentError, mainContent, copyMainContentToProposed]);

  return { data, isLoading: isLoadingMainContent || isLoadingProposed };
};

export default useContentManagement;
