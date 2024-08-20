import React from 'react';
import Card from '../components/Card';
import useCart from '../hooks/useCart';
import useCourse from '../hooks/useCourse';
import LoadingSpinner from '../components/LoadingSpinner';
import AddCart from '../components/AddCart';
import { addCourse } from '../services/courses';
const HomePage = () => {
  const { handlePlusClick } = useCart();
  const { courses, loading, error, setCourses } = useCourse(); // Get setCourses from the hook

const handleAdd = async (item) => {
  const workHours = parseInt(item.work, 10);  // Convert to a number if it's a string
  const newCourse = {
    id: Date.now(),  // Assign a unique ID for the new course
    title: item.name,
    progress: `0 h / ${workHours} h`,  // Ensure the progress is formatted with proper spacing
    icon: item.emoji,
    bgColor: 'from-blue-100 to-blue-300',  // Default color, adjust as needed
  };

  try {
    const addedCourse = await addCourse(newCourse);
    setCourses(prevCourses => [addedCourse, ...prevCourses]); // Add the new course to the top of the list
  } catch (error) {
    console.error('Failed to add course:', error);
  }
};

const handleEditClick = (course) => {
  // Logic for handling the edit action
  console.log('Edit course:', course);
};

const handleDeleteClick = (course) => {
  // Logic for handling the delete action
  console.log('Delete course:', course);
};

  

  if (loading) {
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
        {courses.map((course) => (
          <Card
            key={course.id}
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
