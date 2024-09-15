import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* Main Content */}
      <div className={`flex-1 ${isCollapsed ? 'ml-10' : 'ml-64'}`}>
        {/* Top navigation or other header content could go here */}
        
        {/* Outlet will render the Dashboard or other admin pages */}
        <Outlet />
      </div>
    </div>
  );
}
