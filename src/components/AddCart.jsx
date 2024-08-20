import React, { useState } from 'react';
import InputField from './InputField';

const AddCart = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [work, setWork] = useState('');

  const handleAddClick = () => {
    onAdd({ name, emoji, work });
    setName('');
    setEmoji('');
    setWork('');
  };

  const inputFields = [
    { type: 'text', value: name, onChange: (e) => setName(e.target.value), label: 'Name' },
    { type: 'emoji', value: emoji, onChange: setEmoji, label: 'Emoji' },
    { type: 'number', value: work, onChange: (e) => setWork(e.target.value), label: 'Work' },
  ];

  return (
    <div className="flex space-x-4 items-center mb-4">
      {inputFields.map((field, index) => (
        <InputField key={index} {...field} />
      ))}
      <button
        onClick={handleAddClick}
        className="bg-blue-100 text-blue-500 px-4 py-2 rounded-md flex items-center border border-blue-200"
        style={{ borderRadius: '10px' }}
      >
        <span className="mr-2 text-blue-500">+</span> Add
      </button>
    </div>
  );
};

export default AddCart;
