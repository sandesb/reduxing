import React, { useState } from 'react';
import Card from '../components/Card';
import ItemDialog from '../components/ItemDialog'; // Import the ItemDialog component
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/LoadingSpinner';
import AddCart from '../components/AddCart';
import {
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from '../redux/coursesApi';

const HomePage = () => {
  const { handlePlusClick } = useCart();
  const { data: courses = [], error, isLoading } = useGetCoursesQuery();
  const [addCourse] = useAddCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const [selectedItem, setSelectedItem] = useState(null); // State to hold the selected course
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog visibility

  const handleAdd = async (item) => {
    const workHours = parseInt(item.work, 10);
    const newCourse = {
      title: item.name,
      progress: `0 h / ${workHours} h`,
      icon: item.emoji,
      bgColor: 'from-blue-100 to-blue-300',
    };

    try {
      await addCourse(newCourse);  // Add the course via RTK Query mutation
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  };

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

  const handleTitleClick = (id) => {
    const selectedCourse = courses.find(course => course.id === id);
    if (selectedCourse) {
      setSelectedItem(selectedCourse); // Set the selected course
      setIsDialogOpen(true); // Open the dialog
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false); // Close the dialog
    setSelectedItem(null); // Clear the selected course
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <AddCart onAdd={handleAdd} />
      <h1 className="text-2xl font-medium mb-6 text-gray-700">In Process</h1>
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
            onTitleClick={handleTitleClick} // Handle title click to open dialog
          />
        ))}
      </div>
      {selectedItem && (
        <ItemDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default HomePage;
