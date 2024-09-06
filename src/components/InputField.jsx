import React, { useEffect, useState } from 'react';
import InputEmoji from 'react-input-emoji';

const InputField = ({ type, value, place, onChange, label, customWidth }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size and set isMobile to true for small screens
  useEffect(() => {
    const handleResize = () => {
      // Check if the screen width is less than 640px (Tailwind's sm breakpoint)
      setIsMobile(window.matchMedia('(max-width: 640px)').matches);
    };

    // Set the initial state and listen for window resize events
    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="relative"
      style={{
        width: customWidth, // Use custom width
        minWidth: isMobile ? '100%' : 'auto', // Apply min-width: 100% on small screens
      }}
    >
      {type === 'emoji' ? (
        <div className="relative w-full drop-shadow-sm z-40"> {/* Apply custom shadow */}
          <InputEmoji
            value={value}
            onChange={onChange}
            placeholder="Tap on Emoji..."
            borderRadius={10}
            className="border p-2 rounded-md text-gray-700  "
            style={{ borderRadius: '10px' }}
          />
          <label
            className=" absolute left-6 top-0 text-gray-500 text-xs  bg-white shadow-sm px-1 transform -translate-y-1/2"
            style={{ pointerEvents: 'none', borderRadius: '5px' }}
          >
            {label}
          </label>
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={place}
          className="border p-2 pl-4 rounded-md text-gray-700 w-full  shadow-primary" 
          style={{ borderRadius: '10px' }}
        />
      )}
      {type !== 'emoji' && (
        <label
          className="absolute left-3 top-0 text-gray-500 text-xs  bg-white shadow-sm px-1 transform -translate-y-1/2"
          style={{ pointerEvents: 'none', borderRadius: '5px' }}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default InputField;
