import React, { useState } from 'react';
import InputField from './InputField';
import { v4 as uuidv4 } from 'uuid';
import { useAddCourseMutation } from '../redux/subjectsApi';

const AddCart = ({ refetch }) => {
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');

  const [emoji, setEmoji] = useState('');
  const [work, setWork] = useState('');
  const [addCourse] = useAddCourseMutation();

  const handleAddClick = async () => {
    const workHours = parseInt(work, 10);
    const newCourse = {
      id: uuidv4(),
      title: name,
      progress: `0 / ${workHours}`,
      icon: emoji,
      bgColor: 'from-blue-100 to-blue-300',
    };

    try {
      const { data, error } = await addCourse(newCourse);
      if (error) throw error;
      console.log('Added course:', data);

      // Refetch courses after adding a new one
      refetch();

      // Reset input fields
      setName('');
      setEmoji('');
      setWork('');
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  };

  return (
    <div className="font-lato mt-7 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center mb-8 w-full">
      {/* Pass customWidth prop to give different widths to Name and Chapters */}
      <InputField
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        label="Name"
        place="Name of Subject..."
        customWidth="43%"  // Adjust width for larger screens
      />
      <InputField
        type="emoji"
        value={emoji}
        onChange={setEmoji}
        label="Emoji"
        customWidth="40%"  // Adjust width for larger screens
      />
      <InputField
        type="number"
        value={work}
        onChange={(e) => setWork(e.target.value)}
        label="Chapters"
        place="Total Chapters..."
        customWidth="36%"  // Adjust width for larger screens
      />
      <button
        onClick={handleAddClick}
        className=" bg-blue-100 text-blue-500 px-4 py-2 rounded-md flex items-center border border-blue-200"
        style={{ borderRadius: '10px' }}
      >
        <span className="mr-2 text-blue-500">+</span> Add
      </button>
    </div>
  );
};

export default AddCart;
