// src/hooks/useCourse.js
import { useState, useEffect } from 'react';
import { getCourses } from '../services/courses';

const useCourse = (filterFn) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        const sortedCourses = data.sort((a, b) => b.id - a.id); // Sort by ID, newest first
        const filteredCourses = filterFn ? sortedCourses.filter(filterFn) : sortedCourses;
        setCourses(filteredCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filterFn]);

  return { courses, loading, error, setCourses };
};

export default useCourse;
