// ChatBubble.js
import React from 'react';

const ChatBubble = ({ message, isAI, avatar }) => {
  // Check if the message contains code blocks by looking for "```"
  const isCode = message.includes("```");

  // Format the message content based on whether it's code or plain text
  const renderMessageContent = () => {
    if (isCode) {
      // Remove the code block markers and return the content inside a `pre` and `code` element
      const formattedMessage = message.replace(/```/g, "").trim();
      return (
        <pre className="bg-gray-800 text-white p-2 rounded-md overflow-auto">
          <code>{formattedMessage}</code>
        </pre>
      );
    } else {
      // Split the message by double newlines to handle paragraph separation
      const paragraphs = message.split("\n\n").map((paragraph, index) => (
        <p key={index} className="mb-2">
          {paragraph}
        </p>
      ));

      return paragraphs;
    }
  };

  return (
    <div className={`flex items-start ${isAI ? 'flex-row' : 'flex-row-reverse'} mb-4`}>
      <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full mr-3" />
      <div
        className={`p-4 rounded-lg text-lg ${
          isAI ? 'bg-blue-100' : 'bg-transparent'
        } text-gray-800`}
      >
        {renderMessageContent()}
      </div>
    </div>
  );
};

export default ChatBubble;
