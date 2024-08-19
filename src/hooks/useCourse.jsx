// src/hooks/useCourse.js
import { useState, useEffect } from 'react';

const useCourse = (filterFn) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('src/data/db.json');
        const data = await response.json();
        const filteredCourses = filterFn ? data.courses.filter(filterFn) : data.courses;
        setCourses(filteredCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filterFn]);

  return { courses, loading, error };
};

export default useCourse;
