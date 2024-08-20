import React from 'react';
import Card from '../components/Card';
import useCart from '../hooks/useCart';
import useCourse from '../hooks/useCourse';
import LoadingSpinner from '../components/LoadingSpinner';
import AddCart from '../components/AddCart';

const HomePage = () => {
  const { handlePlusClick } = useCart();

  // Use the useCourse hook without a filter to load all courses
  const { courses, loading, error } = useCourse();

  const handleAdd = (item) => {
    console.log('New item added:', item);
    // Add your custom logic here to handle the new item
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
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
