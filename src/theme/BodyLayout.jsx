import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from '../components/NavBar';
import { setLargeScreen } from '../redux/uiActions';
import CartPopup from '../components/CartPopup';
import FooterWebsite from './FooterWebsite';
import HelpPopup from '../components/HelpPopup';

const BodyLayout = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);
  const isLargeScreen = useSelector((state) => state.ui.isLargeScreen);

  useEffect(() => {
    const handleResize = () => {
      dispatch(setLargeScreen(window.innerWidth >= 1024));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);

  return (
    <div className="bg-primary-bg min-h-screen grid grid-rows-[auto,1fr,auto]">
      <Navbar />
      <CartPopup />
      <HelpPopup />

      <div className={`grid ${isSidebarOpen && isLargeScreen ? 'grid-cols-[auto,1fr]' : 'grid-cols-1'}`}>
        {isSidebarOpen && isLargeScreen && (
          <div className="w-52">
            <Sidebar />
          </div>
        )}
        {/* Updated Outlet Container with Conditional m-6 */}
        <div
          className={`rounded-3xl bg-sidebar-active shadow-lg p-6 lg:mr-7 overflow-y-auto lg:mb-28 ${
            !isSidebarOpen ? 'm-6 shadow-lg' : ''
          }`}
        >
          <Outlet />
        </div>
      </div>
      <div className="mt-8 lg:mt-32 ">
      <FooterWebsite /> {/* Add the Footer here */}
      </div>
    </div>
  );
};

export default BodyLayout;
