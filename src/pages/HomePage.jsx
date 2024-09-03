import React, { useState } from 'react';
import Card from '../components/Card';
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/LoadingSpinner';
import AddCart from '../components/AddCart';
import ItemDialog from '../components/ItemDialog'; // Import the ItemDialog

import {
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from '../redux/coursesApi';

const HomePage = () => {
  const { handlePlusClick } = useCart();
  const { data: courses = [], error, isLoading, refetch } = useGetCoursesQuery();

  const [addCourse] = useAddCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = async (updatedCourse) => {
    try {
      console.log('Updating course:', updatedCourse);

      const { data, error } = await updateCourse(updatedCourse).unwrap();

      if (error) throw error;

      console.log('Course updated successfully:', data);

      refetch(); // Refetch courses to reflect the update
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteCourse(id).unwrap();
      console.log('Deleted course with id:', id);

      refetch(); // Refetch courses to reflect the deletion
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const handleTitleClick = (id) => {
    const selectedCourse = courses.find(course => course.id === id);
    if (selectedCourse) {
      setSelectedItem(selectedCourse);
      setIsDialogOpen(true);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <AddCart refetch={refetch} />
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
            onTitleClick={handleTitleClick} // Pass handleTitleClick to Card
          />
        ))}
      </div>
      {/* ItemDialog to show details and edit notes */}
      {selectedItem && (
        <ItemDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          item={selectedItem} // Pass the selected item
        />
      )}
    </div>
  );
};

export default HomePage;
