import { useEffect, useState } from 'react';
import { useGetCoursesQuery } from '../redux/coursesApi';

const useCourse = (filterFn) => {
  const { data: courses = [], error, isLoading } = useGetCoursesQuery();
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (courses.length > 0) {
      const sortedCourses = courses.sort((a, b) => b.id - a.id); // Sort by ID, newest first
      const filtered = filterFn ? sortedCourses.filter(filterFn) : sortedCourses;
      setFilteredCourses(filtered);
    }
  }, [courses, filterFn]);

  return { courses: filteredCourses, loading: isLoading, error, setCourses: setFilteredCourses };
};

export default useCourse;
