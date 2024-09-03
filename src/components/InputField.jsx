import React from 'react';
import InputEmoji from 'react-input-emoji';

const InputField = ({ type, value, onChange, label }) => {
  return (
    <div className="relative flex-1 w-full">
      {type === 'emoji' ? (
        <div className="relative w-full">
          <InputEmoji
            value={value}
            onChange={onChange}
            placeholder="Tap on Emoji..."
            borderRadius={10}
            className="border p-2 rounded-md text-gray-700"
            style={{ borderRadius: '10px' }}
          />
       
          <label
            className={`absolute left-6 top-0 text-gray-500 text-xs bg-white px-1 transform -translate-y-1/2`}
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
          placeholder="Type Here..."
          className="border p-2 rounded-md text-gray-700 w-full"
          style={{ borderRadius: '10px' }}
        />
      )}
      {type !== 'emoji' && (
        <label
          className={`absolute left-3 top-0 text-gray-500 text-xs bg-white px-1 transform -translate-y-1/2`}
          style={{ pointerEvents: 'none', borderRadius: '5px' }}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default InputField;