// src/components/LoadingSpinner.js
import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

const LoadingSpinner = ({ height = 80, width = 80, color = "#7F9CEA", className = "flex justify-center items-center h-screen" }) => {
  return (
    <div className={className}>
      <ThreeDots 
        height={height} 
        width={width} 
        radius="9"
        color={color} 
        ariaLabel="three-dots-loading"
        visible={true}
      />
    </div>
  );
};

export default LoadingSpinner;
