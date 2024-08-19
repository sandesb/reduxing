import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Home, Mail, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import vaderImage from "../assets/vader.png"; // Import the image

const ActiveCircles = ({ isActive }) => {
  return (
    <>
      {isActive && (
        <>
          {/* Top Right Circle */}
          <span
            className="absolute z-10 top-[-25px] right-[32px] w-[25px] h-[25px]  rounded-full"
            style={{ boxShadow: "9px 9px 0 #f0f4fc" }}
          ></span>
          {/* Bottom Right Circle */}
          <span
            className="absolute z-10 top-[48px] right-[32px] w-[25px] h-[25px]  rounded-full"
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
        initial={{ paddingLeft: "1rem", backgroundColor: "transparent" }}
        animate={{
          paddingLeft: isActive ? "1.5rem" : "1rem",
          backgroundColor: isActive ? "#f0f4fc" : "transparent",
          borderRadius: isActive ? "20px 0 0 20px" : "20px 0 0 20px",
          color: isActive ? "#4b5563" : "#4b5563",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`flex items-center space-x-2 px-4 py-3 ml-4 w-full h-full`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </motion.div>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="relative h-screen flex">
      <div className="absolute top-0 left-0 w-72 h-full bg-primary from-gray-100 to-gray-200 rounded-tr-[60px] rounded-br-[60px] overflow-hidden">
        <div className="h-full w-full bg-primary">
          <div className="flex items-center space-x-2 mb-2 p-4 ml-4">
            {/* Replace the User icon with the vader.png image */}
            <img 
              src={vaderImage} 
              alt="Vader" 
              className="w-12 h-12 rounded-full  border-2 border-blue-400" 
            />
            <div>
              <h2 className="font-semibold text-lg text-gray-700">Sandes</h2>
              <p className="text-sm text-gray-500">Student</p>
            </div>
          </div>
          <nav className="flex flex-col space-y-3">
            <ActiveLink
              to="/my-classes"
              icon={Home}
              label="Courses"
              isActive={location.pathname === "/my-classes"}
            />
            <ActiveLink
              to="/account"
              icon={User}
              label="Account"
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

