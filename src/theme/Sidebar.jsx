import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { HomeIcon, Mail, HelpCircle, Book, FolderHeart } from "lucide-react";
import { motion } from "framer-motion";
import dp from "../assets/logo/user.png"; // Import the image
import { useGetStudentsQuery } from '../redux/studentsApi'; // Import the hook

const ActiveCircles = ({ isActive }) => {
  return (
    <>
      {isActive && (
        <>
          <span
            className="absolute z-10 top-[-25px] right-[32px] w-[25px] h-[25px] rounded-full"
            style={{ boxShadow: "9px 9px 0 #f0f4fc" }}
          ></span>
          <span
            className="absolute z-10 top-[48px] right-[32px] w-[25px] h-[25px] rounded-full"
            style={{ boxShadow: "9px -9px 0 #f0f4fc" }}
          ></span>
        </>
      )}
    </>
  );
};

const ActiveLink = ({ to, icon: Icon, label, isActive }) => {
  return (
    <Link to={to} className="z-20 relative">
      <ActiveCircles isActive={isActive} />
      <motion.div
        initial={{ paddingLeft: "1rem", backgroundColor: "transparent", boxShadow: "none" }}
        animate={{
          paddingLeft: isActive ? "1.5rem" : "1rem",
          backgroundColor: isActive ? "#f0f4fc" : "transparent",
          borderRadius: isActive ? "20px 0 0 20px" : "20px 0 0 20px",
          color: isActive ? " #7F9CEA" : "#4b5563",
          boxShadow: isActive ? "-6px 0px 0px rgba(0, 0, 0, 0.1)" : "none",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex items-center space-x-2 px-4 py-3 ml-4 w-full h-full"
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </motion.div>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);
  const [userName, setUserName] = useState('');
  const { data: students, isLoading, isError, error } = useGetStudentsQuery(); // Fetch all students

  useEffect(() => {
    const matricNo = localStorage.getItem('matricNo'); // Get the logged-in user's matricNo from localStorage

    console.log('Matric No from localStorage:', matricNo);
    console.log('Fetched Students:', students);

    if (matricNo && students) {
      // Directly compare matricNo strings
      const student = students.find((s) => s.matric === matricNo);
      console.log('Matched Student:', student);

      if (student) {
        setUserName(student.name); // Set the user's name
      } else {
        console.log('No matching student found');
      }
    }
  }, [students]);

  return (
    <div className="relative font-lato h-screen flex">
      {/* Static Sidebar for Larger Screens */}
      <div className="absolute top-0 left-0 w-60 h-full bg-primary from-gray-100 to-gray-200 rounded-tr-[60px] rounded-br-[60px] overflow-hidden hidden lg:block">
        <div className="h-full w-full">
          <div className="flex items-center space-x-2 mb-2 p-2 ml-4">
            <img src={dp} alt="User" className="w-12 h-12 rounded-full border-2 border-blue-200 shadow-md" />
            <div>
              {/* Display the fetched user's name */}
              <h2 className="font-semibold text-lg text-gray-700">{userName || 'Guest'}</h2>
              <p className="text-sm text-gray-500">Student</p>
            </div>
          </div>
          <nav className="flex flex-col space-y-1">
            <ActiveLink
              to="/"
              icon={HomeIcon}
              label="Home"
              isActive={location.pathname === "/"}
            />
            <ActiveLink
              to="/my-courses"
              icon={Book}
              label="Courses"
              isActive={location.pathname === "/my-courses"}
            />
            <ActiveLink
              to="/repositories"
              icon={FolderHeart}
              label="Repositories"
              isActive={location.pathname === "/repositories"}
            />
            <ActiveLink
              to="/messages"
              icon={Mail}
              label="Messages"
              isActive={location.pathname === "/messages"}
            />
            <ActiveLink
              to="/help-center"
              icon={HelpCircle}
              label="Help Center"
              isActive={location.pathname === "/help-center"}
            />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
