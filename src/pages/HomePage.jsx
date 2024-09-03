import React, { useState } from 'react';
import Card from '../components/Card';
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/LoadingSpinner';
import supabase from '../config/supabaseClient';

import {
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from '../redux/coursesApi';
import AddCart from '../components/AddCart';

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
        // Refetch data from the server to ensure synchronization
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
      await deleteCourse(id);
      console.log('Deleted course with id:', id);
      
      // Refetch data from the server to ensure synchronization
      refetch();
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
            onTitleClick={handleTitleClick}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
