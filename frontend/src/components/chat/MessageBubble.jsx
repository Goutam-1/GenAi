import React from 'react';
import { User, Bot } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  // Helper function to check if content is a URL (for image generation)
  const isImageUrl = message.content?.startsWith('https://image.pollinations.ai');

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-2xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500' : 'bg-purple-500'
        }`}>
          {isUser ? (
            <User size={18} className="text-white" />
          ) : (
            <Bot size={18} className="text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block px-4 py-2 rounded-lg ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-100'
          }`}>
            {isImageUrl ? (
              <img 
                src={message.content} 
                alt="Generated" 
                className="max-w-sm rounded-md"
              />
            ) : message.content.startsWith('{') ? (
              <div className="text-sm">
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(JSON.parse(message.content), null, 2)}
                </pre>
              </div>
            ) : (
              <p className="whitespace-pre-wrap break-words text-sm">
                {message.content}
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(message.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
