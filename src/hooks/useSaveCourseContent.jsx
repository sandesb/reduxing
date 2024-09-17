import { useCallback } from 'react';
import { useUpdateProposedContentMutation } from '../redux/coursesApi';

// Define the mergeCourseContent function here
const mergeCourseContent = (existingData, db_id, newNote) => {
  const updatedData = existingData ? { ...existingData } : {};

  // Ensure newNote has the correct structure before attempting to access properties
  if (newNote && newNote.blocks) {
    // Add or overwrite the note for this db_id
    updatedData[db_id] = {
      blocks: newNote.blocks,
      time: newNote.time || Date.now(),
      version: newNote.version || '2.0',  // Ensure version is set
    };
  } else {
    console.error('Invalid newNote format: blocks are missing');
  }

  return updatedData;
};

const useSaveCourseContent = () => {
  const [updateProposedContent] = useUpdateProposedContentMutation();

  // Save content function, responsible for upserting the correct data
  const saveCourseContent = useCallback(async (matricNo, db_id, newData, existingCourseData) => {
    if (!db_id || !matricNo || matricNo === 'guest') return;

    // Merge the new content into the existing course data for this db_id
    const updatedCourseData = mergeCourseContent(existingCourseData, db_id, newData);

    try {
      // Perform the upsert to update or insert the course_data in proposedcontent
      await updateProposedContent({
        matric: matricNo,
        db_id,
        newNote: newData,  // New note data
        course_data: updatedCourseData  // Updated course_data object
      }).unwrap();

      console.log('Course content saved successfully');
    } catch (error) {
      console.error('Error saving course content:', error);
    }
  }, [updateProposedContent]);

  return { saveCourseContent };
};

export default useSaveCourseContent;
