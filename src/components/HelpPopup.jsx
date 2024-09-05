import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Minus } from "lucide-react";
import { useGetCoursesQuery } from "../redux/coursesApi";
// import ItemDialog from "./ItemDialog"; 

const HelpPop = () => {
  const isHelpPopupVisible = useSelector(
    (state) => state.ui.isHelpPopupVisible
  );

  if (!isHelpPopupVisible) return null;




  return (
    <>
      <div className="fixed top-16 right-4 w-80 bg-white shadow-lg rounded-lg z-50">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-700">Help</h2>
        </div>
      
      </div>

     
    </>
  );
};

export default HelpPop;
