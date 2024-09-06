import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  User,
  Menu,
  ShoppingCart,
  Lightbulb,
  MessageCircleHeart,
  MessageCircleQuestion,
  ChevronsLeftRight,
  MessageSquareCode,
  MessageCircleCode,
} from "lucide-react";
import {
  toggleSidebar,
  toggleCartPopup,
  toggleHelpPopup,
  loadCourses,
  loadCartData,
} from "../redux/uiActions";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import reduxLogo from "../assets/redux.png";
import logo from "../assets/logo/babyblue.png";
import { motion } from "framer-motion";
import { Home, Book, FolderHeart, Mail, HelpCircle } from "lucide-react"; // Import necessary Lucide icons
import { useLocation } from "react-router-dom";
import dp from "../assets/dp.jpg"; // Import the image

const Navbar = () => {
  const ActiveLink = ({ to, icon: Icon, label, isActive }) => {
    const location = useLocation();

    // Ensure exact matching for active state
    const isExactActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={`flex items-center space-x-2 py-3 px-2 rounded-md text-gray-600 ${
          isExactActive
            ? "bg-sidebar-active text-gray-600"
            : "hover:bg-sidebar-active"
        } transition`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </Link>
    );
  };
  const dispatch = useDispatch();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // Local state for mobile sidebar

  const cartCount = useSelector((state) => state.ui.cartCount);

  useEffect(() => {
    dispatch(loadCourses());
    dispatch(loadCartData()); // Ensure cart data is loaded on mount
  }, [dispatch]);

  const handleToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Dynamically handle sidebar toggle based on screen size
    if (window.innerWidth >= 1024) {
      // For large screens, use Redux to toggle sidebar
      dispatch(toggleSidebar());
    } else {
      // For small screens, toggle local mobile sidebar state
      setIsMobileSidebarOpen((prev) => !prev);
    }
  };

  const handleCartClick = () => {
    dispatch(toggleCartPopup());
  };

  const handleHelpClick = () => {
    dispatch(toggleHelpPopup());
  };

  return (
    <div className="font-lato flex justify-between items-center py-4 bg-primary from-gray-100 to-gray-200 w-full">
      <div className="flex items-center  ">
        <Link
          to="/"
          className="flex items-center text-3xl space-y-1 font-bold text-gray-700 pl-3 pr-10"
        >
          <img
            src={logo}
            alt="Redux Logo"
            className="w-12 h-12  text-center "
          />

          <h1 className="pl-2 font-semibold text-2xl font-lato mb-3 lg:mb-0">Academix</h1>
        </Link>
        <div className="flex space-x-4 ">
        
          {/* The SearchBar will only be visible on screens larger than 640px */}
          <div className="hidden sm:block w-full">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 pr-6 mb-3">

      <button
            onClick={handleToggle}
            className="p-2  lg:mb-0 text-gray-600 rounded-md flex items-center"
          >
            <MessageCircleCode className="w-6 h-6 "/>
          </button>

        <div className="relative " onClick={handleCartClick}>
          <span className="absolute -bottom-4 -left-4   bg-red-500 text-white text-xs font-extralight rounded-full px-2 py-0.5 shadow">
            {cartCount}
          </span>
          <MessageCircleHeart className="w-6 h-6 text-gray-600 cursor-pointer " />
        </div>

        <MessageCircleQuestion
          onClick={handleHelpClick}
          className="w-6 h-6  text-gray-600 cursor-pointer"
        />
      </div>

      {/* Mobile Sidebar (hidden on large screens) */}
      <motion.div
        className="fixed shadow-2xl z-40 top-0 left-0 h-full w-60 bg-primary text-gray-300 from-gray-100 to-gray-200 rounded-tr-[60px] rounded-br-[60px] overflow-hidden lg:hidden"
        initial={{ x: "-100%" }} // Initially off-screen
        animate={{ x: isMobileSidebarOpen ? "0%" : "-100%" }} // Toggle based on state
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="h-full  bg-primary-bg w-full">
          <div className="flex items-center justify-center py-4 mb-2">
            <img
              src={dp}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-blue-200 shadow-md"
            />
          </div>

          <nav className="flex flex-col space-y-3 px-4">
            <ActiveLink
              to="/"
              icon={Home}
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
      </motion.div>
    </div>
  );
};

export default Navbar;
