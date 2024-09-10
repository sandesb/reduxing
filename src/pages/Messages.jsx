import React from 'react';
import Card from '../components/Card';
import useCourse from '../hooks/useCourse';
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/LoadingSpinner'; // Import the reusable loading spinner

const Messages = () => {

  const filterFn = (course) => course.id >= 6 && course.id <= 9;
  const { courses, loading, error } = useCourse(filterFn);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
    <h1 className="text-2xl font-medium mb-6 text-gray-700 text-center">Messages</h1>

    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <div className="flex justify-center items-center">
        <div className="text-center">
          <h1 className="font-lato text-4xl lg:text-6xl mt-2 mb-2 font-semibold text-primary-bg tracking-widest relative">
            <span className="block lg:inline lg:pl-4">No Any Sandes...yet</span>
            <span className="absolute top-0 left-0 w-full h-full text-[#a2b5ea] transform translate-x-0.5 translate-y-0 -z-10 tracking-widest">
              <span className="block lg:inline lg:pl-4">No Any Sandes...yet</span>
            </span>
          </h1>
        </div>
      </div>
    </div></div>
  );
};

export default Messages;