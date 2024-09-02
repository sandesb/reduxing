import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import ItemDialog from '../components/ItemDialog'; 
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/LoadingSpinner';
import supabase from '../config/supabaseClient';
const MyClasses = () => {
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
      console.log('Fetched data:', data); // Debugging
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (item) => {
    const workHours = parseInt(item.work, 10);
    const newCourse = {
      title: item.name,
      progress: `0 h / ${workHours} h`,
      icon: item.emoji,
      bgColor: 'from-blue-100 to-blue-300',
    };

    try {
      const { data, error } = await supabase.from("db").insert([newCourse]);
      if (error) throw error;
      setCourses([...courses, ...data]);
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  };

  const handleEditClick = async (updatedCourse) => {
    try {
      const { data, error } = await supabase.from("db").update(updatedCourse).eq('id', updatedCourse.id);
      if (error) throw error;
      setCourses(courses.map(course => course.id === updatedCourse.id ? updatedCourse : course));
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const { error } = await supabase.from("db").delete().eq('id', id);
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
      <h1 className="text-2xl font-medium mb-6 text-gray-700">My Courses</h1>
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

export default MyClasses;
