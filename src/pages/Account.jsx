// src/pages/Account.js
import React from 'react';
import Card from '../components/Card';
import useCourse from '../hooks/useCourse';
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/LoadingSpinner'; // Import the reusable loading spinner

const Account = () => {
  const { handlePlusClick } = useCart();

  const filterFn = (course) => course.id >= 6 && course.id <= 9;
  const { courses, loading, error } = useCourse(filterFn);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-6 text-gray-700">My Account</h1>
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

export default Account;
