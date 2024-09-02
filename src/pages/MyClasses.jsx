import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
// import ItemDialog from '../components/ItemDialog'; 
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/LoadingSpinner';
import supabase from '../config/supabaseClient';

const MyClasses = () => {
  const { handlePlusClick } = useCart();
  const [courses, setCourses] = useState([]);
  const [updatedCourses, setUpdatedCourses] = useState([]);

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
      console.log('Added course:', data); // Debugging
      setCourses([...courses, ...data]);
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  };

  const handleEditClick = async (updatedCourse) => {
    try {
      console.log('Updating course:', updatedCourse);
  
      // Perform the update in Supabase and return the updated row
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
        // Update local state with the returned updated data
        setCourses(courses.map(course => 
          course.id === updatedCourse.id ? data[0] : course
        ));
      } else {
        console.log('No rows returned after update.');
      }
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };
  
  
  
  

  
  
  

  const handleDeleteClick = async (id) => {
    try {
      const { data, error } = await supabase.from("db").delete().eq('id', id);
      if (error) throw error;
      console.log('Deleted course with id:', id); // Debugging
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

export default MyClasses;
