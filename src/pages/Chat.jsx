import React, { useState, useEffect } from 'react';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import { useGetChatResponseMutation } from '../redux/chatApi';
import userAvatar from '../assets/logo/ava4-bg.webp';
import aiAvatar from '../assets/logo/colorized.png';
import chatSvg from '../assets/logo/chat.svg';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [getChatResponse, { isLoading }] = useGetChatResponseMutation();

  const handleSend = async (userMessage) => {
    setMessages((prev) => [...prev, { text: userMessage, isAI: false, avatar: userAvatar }]);
    setMessages((prev) => [...prev, { text: '🤔Thinking...', isAI: true, avatar: aiAvatar, typing: true }]);

    await getChatResponse({ message: userMessage }).unwrap()
      .then((response) => {
        setMessages((prev) =>
          prev.filter((msg) => !msg.typing).concat({ text: response, isAI: true, avatar: aiAvatar })
        );
      })
      .catch(() => {
        setMessages((prev) =>
          prev.filter((msg) => !msg.typing).concat({ text: 'Error: Could not reach the server.', isAI: true, avatar: aiAvatar })
        );
      });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto ">
      {messages.length === 0 && (
        <div className="flex justify-center items-center">
          <img src={chatSvg} alt="Chat Illustration" className="w-80 h-80" />
          <h1 className=" font-lato sm:text-2xl mr-12 lg:text-4xl mt-2 ml-6 mb-2 font-semibold text-blue-400 tracking-widest relative   ">
            AI Sanga Kura Garne, haina ta?
          </h1>
        </div>
      )}
      <div id="chat-box" className="mb-4 overflow-y-auto">
        {messages.map((message, index) => (
          <ChatBubble key={index} message={message.text} isAI={message.isAI} avatar={message.avatar} />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default Chat;
