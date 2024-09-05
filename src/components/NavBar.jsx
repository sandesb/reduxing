import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, User, Menu, ShoppingCart, Lightbulb, MessageCircleHeart, MessageCircleQuestion } from 'lucide-react';
import { toggleSidebar, toggleCartPopup, toggleHelpPopup, loadCourses, loadCartData } from '../redux/uiActions';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import reduxLogo from '../assets/redux.png';

const Navbar = () => {
  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state.ui.cartCount);

  useEffect(() => {
    dispatch(loadCourses());
    dispatch(loadCartData()); // Ensure cart data is loaded on mount
  }, [dispatch]);

  const handleToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleCartClick = () => {
    dispatch(toggleCartPopup());
  };

  const handleHelpClick = () => {
    dispatch(toggleHelpPopup());
  };

  return (
    <div className="flex justify-between items-center py-4 bg-primary from-gray-100 to-gray-200 w-full">
      <div className="flex items-center space-x-4 ">
        <Link to="/" className="flex items-center text-xl font-bold text-gray-700 pl-6 pr-10">
          <div className='flex w-8 h-8 bg-white rounded-2xl'>
          <img src={reduxLogo} alt="Redux Logo" className="w-8 h-8   text-center " />
          </div> 
          
          <h1 className='pl-2 font-semibold'>React+Redux</h1>
        </Link>
        <div className="flex space-x-4 ">
          <button onClick={handleToggle} className="p-2 text-gray-700 rounded-md flex items-center">
            <Menu className="w-5 h-5 " />
          </button>
          {/* The SearchBar will only be visible on screens larger than 640px */}
          <div className="hidden sm:block w-full">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 pr-6 mb-3">
        <div className="relative " onClick={handleCartClick}>
          <span className="absolute -bottom-4 -left-4   bg-red-500 text-white text-xs font-extralight rounded-full px-2 py-0.5 shadow">
            {cartCount}
          </span>
          <MessageCircleHeart  className="w-6 h-6 text-gray-600 cursor-pointer " />
        </div>
        
        <MessageCircleQuestion onClick={handleHelpClick} className="w-6 h-6  text-gray-600 cursor-pointer" />
      </div>
    </div>
  );
};

export default Navbar;
