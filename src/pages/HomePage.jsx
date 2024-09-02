import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
// import ItemDialog from '../components/ItemDialog';
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/LoadingSpinner';
import AddCart from '../components/AddCart';
import supabase from '../config/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

import {
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from '../redux/coursesApi';

const HomePage = () => {
  const { handlePlusClick } = useCart();
  const { data: initialCourses = [], error, isLoading, refetch } = useGetCoursesQuery();
  
  // Local state to manage courses
  const [courses, setCourses] = useState(initialCourses);

  const [addCourse] = useAddCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const [selectedItem, setSelectedItem] = useState(null); // State to hold the selected course
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog visibility

  useEffect(() => {
    setCourses(initialCourses);
  }, [initialCourses]);

  // Handle adding a new course
  const handleAdd = async (item) => {
    const workHours = parseInt(item.work, 10);
    const newCourse = {
      id: uuidv4(),
      title: item.name,
      progress: `0 h / ${workHours} h`,
      icon: item.emoji,
      bgColor: 'from-blue-100 to-blue-300',
    };

    try {
      const { data, error } = await addCourse(newCourse);  // Add the course via RTK Query mutation
      if (error) throw error;
      console.log('Added course:', data);
      
      // Update the local courses state with the newly added course
      setCourses(prevCourses => [...prevCourses, newCourse]);
      
      // Optionally refetch data from the server to ensure synchronization
      refetch();
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  };

  // Handle editing an existing course
  const handleEditClick = async (updatedCourse) => {
    try {
      console.log('Updating course:', updatedCourse);
  
      const { data, error } = await supabase
        .from("db")
        .update({
          title: updatedCourse.title,
          progress: updatedCourse.progress,
          icon: updatedCourse.icon,
          bgColor: updatedCourse.bgColor,
        })
        .eq('id', updatedCourse.id)
        .select(); // Ensure it returns the updated row
  
      if (error) throw error;
  
      console.log('Course updated successfully in Supabase:', data);
  
      if (data.length > 0) {
        console.log('Updated row:', data[0]);
        // Update the local courses state with the updated course
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.id === updatedCourse.id ? data[0] : course
          )
        );
        
        // Optionally refetch data from the server to ensure synchronization
        refetch();
      } else {
        console.log('No rows returned after update.');
      }
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  // Handle deleting a course
  const handleDeleteClick = async (id) => {
    try {
      await deleteCourse(id);  // Delete the course via RTK Query mutation
      console.log('Deleted course with id:', id);
      
      // Update the local courses state after deletion
      setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
      
      // Optionally refetch data from the server to ensure synchronization
      refetch();
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
      {/* {selectedItem && (
        <ItemDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          item={selectedItem}
        />
      )} */}
    </div>
  );
};

export default HomePage;
