import { useEffect, useState, useCallback } from 'react';
import { useLoadProposedContentQuery } from '../redux/coursesApi'; // Import the query hook
const useFetchProposedContent = ({ db_id, matricNo }) => {
  const [courseContent, setCourseContent] = useState(null);
  const { data: proposedContent, isLoading, error } = useLoadProposedContentQuery({ matricNo });

  // Fetch and filter the proposed content for the current db_id (course)
  const fetchCourseContent = useCallback(() => {
    if (!proposedContent || proposedContent.length === 0) return;

    // Find the first entry for the given matricNo
    const studentContent = proposedContent.find((entry) => entry.matric === matricNo);

    if (studentContent && studentContent.course_data) {
      const courseData = studentContent.course_data[db_id];  // Fetch the content for this db_id
      if (courseData) {
        setCourseContent(courseData);
      } else {
        console.warn(`No content found for db_id: ${db_id}`);
      }
    }
  }, [proposedContent, db_id, matricNo]);

  // Fetch the content once data is available
  useEffect(() => {
    if (!isLoading && !error) {
      fetchCourseContent();
    }
  }, [isLoading, error, fetchCourseContent]);

  return { courseContent, isLoading, error };
};

export default useFetchProposedContent;
