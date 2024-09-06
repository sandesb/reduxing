import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { User, Home, Mail, HelpCircle, Book, FolderHeart, HomeIcon  } from "lucide-react";
import { motion } from "framer-motion";
import dp from "../assets/dp.jpg"; // Import the image
import { toggleSidebar } from '../redux/uiActions';  // Import existing Redux action for toggling sidebar

const ActiveCircles = ({ isActive }) => {
  return (
    <>
      {isActive && (
        <>
          {/* Top Right Circle */}
          <span
            className="absolute z-10 top-[-25px] right-[32px] w-[25px] h-[25px]  rounded-full "
            style={{ boxShadow: "9px 9px 0 #f0f4fc" }}
          ></span>
          {/* Bottom Right Circle */}
          <span
            className="absolute z-10 top-[48px] right-[32px] w-[25px] h-[25px]  rounded-full "
            style={{ boxShadow: "9px -9px 0 #f0f4fc" }}
          ></span>
        </>
      )}
    </>
  );
};

const ActiveLink = ({ to, icon: Icon, label, isActive }) => {
  return (
    <Link to={to} className="relative">
      <ActiveCircles isActive={isActive} />
      <motion.div
        initial={{ paddingLeft: "1rem", backgroundColor: "transparent", boxShadow: "none" }}
        animate={{
          paddingLeft: isActive ? "1.5rem" : "1rem",
          backgroundColor: isActive ? "#f0f4fc" : "sidebar-active",
          borderRadius: isActive ? "20px 0 0 20px" : "20px 0 0 20px",
          color: isActive ? " #7F9CEA" : "#4b5563",
          boxShadow: isActive ? "-6px 0px 0px rgba(162, 181, 234, 1)" : "none", // Shadow only on the left side
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
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen); // Check the Redux state

  console.log("Sidebar open state:", isSidebarOpen); // Add this for debugging


  return (
    <div className="z-40 relative font-lato h-screen flex">
  
 {/* Static Sidebar for Larger Screens */}
 <div className="absolute top-0 left-0 w-60 h-full bg-primary from-gray-100 to-gray-200 rounded-tr-[60px] rounded-br-[60px] overflow-hidden hidden lg:block">
        <div className="h-full w-full">
          <div className="flex items-center space-x-2 mb-2 p-2 ml-4">
            <img src={dp} alt="Vader" className="w-12 h-12 rounded-full border-2 border-blue-200 shadow-md" />
            <div>
              <h2 className="font-semibold text-lg text-gray-700">Sandes</h2>
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
              to="/my-classes"
              icon={Book}
              label="Courses"
              isActive={location.pathname === "/my-classes"}
            />
            <ActiveLink
              to="/account"
              icon={FolderHeart}
              label="Repositories"
              isActive={location.pathname === "/account"}
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

