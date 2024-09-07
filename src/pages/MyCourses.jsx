import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/LoadingSpinner';
import supabase from '../config/supabaseClient';
import ReorderWrapper from '../components/ReorderWrapper'; // Import the ReorderWrapper component

const MyCourses = () => {
  const { handlePlusClick } = useCart();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null); 
  const [isDialogOpen, setIsDialogOpen] = useState(false); 

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase.from("db").select();
      if (error) throw error;
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = async (updatedCourse) => {
    try {
      const { data, error } = await supabase
        .from("db")
        .update({
          title: updatedCourse.title,
          progress: updatedCourse.progress,
          icon: updatedCourse.icon,
          bgColor: updatedCourse.bgColor,
        })
        .eq('id', updatedCourse.id)
        .select(); 
  
      if (error) throw error;

      if (data.length > 0) {
        setCourses(courses.map(course => 
          course.id === updatedCourse.id ? data[0] : course
        ));
      }
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const { data, error } = await supabase.from("db").delete().eq('id', id);
      if (error) throw error;
      setCourses(courses.filter(course => course.id !== id));
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-6 text-gray-700 text-center">My Courses</h1>
      
      <ReorderWrapper items={courses} setItems={setCourses}>
        {(course) => (
          <Card
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
        )}
      </ReorderWrapper>
    </div>
  );
};

export default MyCourses;
