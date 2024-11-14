// ChatInput.js
import React from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = React.useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex items-center mb-10 gap-2 p-4  rounded-xl shadow-md">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress} // Listen for Enter key press

        placeholder="Enter a prompt here..."
        className="flex-grow p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring focus:ring-blue-300"
      />
      <button
        onClick={handleSend}
        className="p-2 rounded-xl bg-[#7F9CEA] text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatInput;
