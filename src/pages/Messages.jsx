import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner'; // Import the reusable loading spinner
import { useGetStudentsQuery } from '../redux/studentsApi';
const Messages = () => {
  const { data: students, error, isLoading } = useGetStudentsQuery(); // Fetch students data using studentsApi

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6 text-gray-700 text-center">Students List</h1>

      <div className="min-h-screen flex flex-col justify-center items-center p-6">
        <div className="flex justify-center items-center">
          <div className="text-center">
            {students.length > 0 ? (
              <ul className="list-none">
                {students.map((student) => (
                  <li key={student.id} className="mb-4">
                    <div className="bg-white shadow-md rounded-lg p-4 max-w-sm mx-auto">
                      <h2 className="text-xl font-semibold">{student.name}</h2>
                      <p>Matric: {student.matric}</p>
                      <p>Email: {student.email}</p>
                      <p>Semester: {student.semester}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <h1 className="font-lato text-4xl lg:text-6xl mt-2 mb-2 font-semibold text-primary-bg tracking-widest relative">
                <span className="block lg:inline lg:pl-4">No Students Available</span>
                <span className="absolute top-0 left-0 w-full h-full text-[#a2b5ea] transform translate-x-0.5 translate-y-0 -z-10 tracking-widest">
                  <span className="block lg:inline lg:pl-4">No Students Available</span>
                </span>
              </h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
