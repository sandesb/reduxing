import React from 'react';
import Card from '../components/Card';
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/LoadingSpinner';
import AddCart from '../components/AddCart';
import {
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from '../redux/coursesApi';

const MyClasses = () => {
  const { handlePlusClick } = useCart();
  
  const { data: courses = [], error, isLoading } = useGetCoursesQuery();
  const [addCourse] = useAddCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();


  
  const handleEditClick = async (updatedCourse) => {
    try {
      await updateCourse(updatedCourse);  // Update the course via RTK Query mutation
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteCourse(id);  // Delete the course via RTK Query mutation
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-6 text-gray-700">My Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.slice().reverse().map((course) => ( // Reversing the order of the courses
          <Card
            key={course.id}
            id={course.id}  // Pass the id to the Card component
            title={course.title}
            progress={course.progress}
            icon={course.icon}
            bgColor={course.bgColor}
            onPlusClick={handlePlusClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </div>
    </div>
  );
};

export default MyClasses;
