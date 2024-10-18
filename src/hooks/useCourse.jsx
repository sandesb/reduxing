import { useEffect, useState } from 'react';
import { useGetCoursesQuery } from '../redux/subjectsApi';
const useCourse = (filterFn) => {
  const { data: courses = [], error, isLoading } = useGetCoursesQuery();
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (courses.length > 0) {
      const sortedCourses = [...courses].sort((a, b) => b.id - a.id);
      const filtered = filterFn ? sortedCourses.filter(filterFn) : sortedCourses;
      // Only update state if filteredCourses is different
      if (JSON.stringify(filtered) !== JSON.stringify(filteredCourses)) {
        setFilteredCourses(filtered);
      }
    }
  }, [courses, filterFn]);

  return { courses: filteredCourses, loading: isLoading, error, setCourses: setFilteredCourses };
};

export default useCourse;
