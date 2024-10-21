import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch from Redux
import { useGetMessagesQuery, useAddMessageMutation, useDeleteMessageMutation } from '../redux/messagesApi';
import supabase from '../config/supabaseClient'; // Supabase client initialization
import { Trash2 } from 'lucide-react'; // Lucide icon for delete
import messagesApi from '../redux/messagesApi';
const Messages = () => {
  const dispatch = useDispatch(); // Initialize dispatch
  const { data: messages = [], error, isLoading } = useGetMessagesQuery();
  const [addMessage] = useAddMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [messageText, setMessageText] = useState('');

  const matricNo = localStorage.getItem('matricNo') || 'GUEST';
  const studentName = localStorage.getItem('studentName') || 'GUEST';
  const isAdmin = localStorage.getItem('adminIsAuthenticated') === 'true';

  // Step 1: Initialize and subscribe to the channel once
  useEffect(() => {
    const channel = supabase.channel('room-1', {
      config: { broadcast: { self: true } },
    });

    // Subscribe to broadcast messages
    channel
      .on('broadcast', { event: 'new-message' }, (payload) => {
        console.log('Received broadcasted message:', payload);

        // Safely extract message from the nested payload
        const newMessage = payload?.payload?.message || {}; // Correct the path to message
        
        // Check for valid message structure
        if (newMessage && newMessage.matric_no && newMessage.message_text && newMessage.created_at) {
          // Dispatch the new message to the Redux store
          dispatch(
            messagesApi.util.updateQueryData('getMessages', undefined, (draft) => {
              draft.unshift(newMessage); // Add the broadcasted message to the top
            })
          );
        } else {
          console.error('Received invalid message structure:', payload);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to channel room-1');
        }
      });

    return () => {
      // Cleanup: Unsubscribe when the component unmounts
      supabase.removeChannel(channel);
    };
  }, [dispatch]); // Ensure dispatch is included as a dependency

  const handleSendMessage = async () => {
    if (!messageText.trim()) return; // Prevent sending empty messages

    console.log('Sending Message:', messageText);
    
 // Step 3: Broadcast the message to other clients
const newMessage = {
  message_text: messageText,
  matric_no: matricNo,
  student_name: studentName,
  is_admin: isAdmin,
  created_at: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' }), // Nepal Time
};

    await addMessage(newMessage);

    // Broadcast the message to other users
    const channel = supabase.channel('room-1'); // Get the existing channel
    channel.send({
      type: 'broadcast',
      event: 'new-message',
      payload: { message: newMessage }, // Broadcast correct message structure
    });

    setMessageText(''); // Clear the input field after sending
  };

  // Handle the ENTER key to send a message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(); // Trigger message send on ENTER key press
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this message?');
    
    if (isConfirmed) {
      console.log('Deleting message:', messageId);
      await deleteMessage(messageId); // Call the mutation to delete the message
    }
  };

  return (
    <div className="chat-container  p-6 rounded-xl shadow-lg max-w-screen-md mx-auto lg:mt-10 mt-5">
      
       <div className="text-2xl font-medium mb-6 text-gray-700 text-center">
       <h1 className="font-lato text-4xl lg:text-6xl mt-2 mb-2 font-semibold text-blue-400 tracking-widest relative">
            <span className="block lg:inline lg:pl-4">What's  Your  Sandes? 🕊</span>
            <span className="absolute top-0 left-0 w-full h-full text-[#a2b5ea] transform translate-x-0.5 translate-y-0 -z-10 tracking-widest">
              <span className="block lg:inline lg:pl-4">What's  Your  Sandes? 🕊</span>
            </span>
            </h1>
        </div>

      {/* Messages Box */}
      <div className="messages-box max-h-80 overflow-y-auto p-4 bg-white rounded-lg shadow-inner space-y-4">
        {/* Messages Loading/Error handling */}
        {isLoading && <p>Loading messages...</p>}
        {error && <p>Error loading messages...</p>}
        
        {/* Display Messages */}
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            msg && msg.matric_no && msg.message_text && ( // Check if the message has required fields
              <div
                key={msg.message_id}
                className={`message-item group relative flex ${
                  (msg.matric_no === matricNo && !msg.is_admin) || (isAdmin && msg.is_admin) 
                    ? 'justify-end' 
                    : 'justify-start'
                } mb-4`}
              >
                <div
                  className={`message-bubble p-3 max-w-xs ${
                    (msg.matric_no === matricNo && !msg.is_admin) || (isAdmin && msg.is_admin)
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-black rounded-bl-none'
                  } rounded-lg shadow-md relative`}
                >
                  {/* Display Sender */}
                  <p className="font-bold mb-1">
                    {msg.is_admin ? 'ADMIN' : msg.student_name || 'GUEST'}
                  </p>
                  {/* Message Text */}
                  <p>{msg.message_text}</p>
                  {/* Timestamp */}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>

                  {/* Delete Button (Visible only for self messages) */}
                  {(msg.matric_no === matricNo || (isAdmin && msg.is_admin)) && (
                    <button
                      onClick={() => handleDeleteMessage(msg.message_id)}
                      className="absolute left-0 -ml-6 mt-2 p-2 hidden group-hover:block"
                      title="Delete Message"
                    >
                      <Trash2 className="text-gray-500 hover:text-red-500" size={20} />
                    </button>
                  )}
                </div>
              </div>
            )
          ))
        ) : (
          <p>No messages yet. Be the first to send a message!</p>
        )}
      </div>

      {/* Input to Send Message */}
      <div className="chat-input flex mt-4">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown} // Listen for ENTER key press
          placeholder="Type your message..."
          className="border border-gray-300 rounded-lg p-2 w-full"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-400 text-white p-2 ml-2 rounded-lg shadow-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
