import React from 'react';

const InputRepo = ({ label, type, name, value, onChange, required, accept, rows }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
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
          value={value}
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
