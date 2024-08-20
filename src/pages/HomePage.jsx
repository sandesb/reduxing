import React from 'react';
import Card from '../components/Card';
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/LoadingSpinner';
import AddCart from '../components/AddCart';
import {
  useFetchCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from '../redux/coursesApi';

const HomePage = () => {
  const { handlePlusClick } = useCart();

  // Fetch courses with the useFetchCoursesQuery hook
  const { data: courses = [], isLoading, error } = useFetchCoursesQuery();

  // Set up the mutations for creating, updating, and deleting courses
  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const handleAdd = async (item) => {
    const workHours = parseInt(item.work, 10);
    const newCourse = {
      title: item.name,
      progress: `0 h / ${workHours} h`,
      icon: item.emoji,
      bgColor: 'from-blue-100 to-blue-300',
    };

    try {
      await createCourse(newCourse).unwrap(); // Unwrap to handle any errors
      // No need to refetch, RTK Query will auto-update due to invalidation
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  };

  const handleEditClick = async (updatedCourse) => {
    try {
      await updateCourse({ id: updatedCourse.id, ...updatedCourse }).unwrap();
      // No need to refetch, RTK Query will auto-update due to invalidation
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteCourse(id).unwrap();
      // No need to refetch, RTK Query will auto-update due to invalidation
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <AddCart onAdd={handleAdd} />
      <h1 className="text-2xl font-medium mb-6 text-gray-700">In Process</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.slice().reverse().map((course) => (
          <Card
            key={course.id}
            id={course.id}
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

export default HomePage;
