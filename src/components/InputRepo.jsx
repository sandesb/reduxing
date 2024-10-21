import React from 'react';

const InputRepo = ({ label, type, name, value, onChange, required, accept, rows }) => {
  console.log(`${name} value:`, value); // Log to check if value is being passed correctly

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value || ''} // Ensure value is not undefined
          onChange={onChange}
          className="border rounded w-full py-2 px-3 text-gray-700"
          rows={rows || '4'}
          required={required}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value || ''} // Ensure value is not undefined
          onChange={onChange}
          accept={accept}
          className="border rounded w-full py-2 px-3 text-gray-700"
          required={required}
        />
      )}
    </div>
  );
};

export default InputRepo;
