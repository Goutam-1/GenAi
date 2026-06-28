import React, { useEffect, useState } from 'react';
import { User, Bot, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ResumeViewer from './ResumeViewer';

const ChatViewer = () => {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/conversation/${conversationId}`,
          { withCredentials: true }
        );
        setConversation(response.data.conversation);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId]);

  // Render resume analysis with special UI
  const renderResumeContent = () => {
    const assistantMessage = messages.find(m => m.role === 'assistant');
    if (!assistantMessage) return null;

    try {
      const analysis = JSON.parse(assistantMessage.content);
      return <ResumeViewer analysis={analysis} />;
    } catch (error) {
      console.error('Failed to parse resume analysis:', error);
      return <p className="text-gray-400">Failed to display resume analysis</p>;
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-58px)] bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-gray-400" size={32} />
          <p className="text-gray-400">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-58px)] bg-black flex flex-col">

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scale-100 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {/* Resume Type - Show Special UI */}
        {conversation?.featureType === 'resume' ? (
          renderResumeContent()
        ) : (
          // Text/Image Type - Show Message Bubbles
          <div className="max-w-4xl mx-auto space-y-5">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">No messages in this conversation</p>
              </div>
            ) : (
              messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                      <Bot size={18} color="white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm md:text-base whitespace-pre-wrap ${
                      message.role === 'user'
                        ? 'bg-[#1f1f1f] text-white'
                        : 'bg-[#181818] text-gray-200'
                    }`}
                  >
                    {message.content.startsWith('https://image.pollinations.ai') ? (
                      <img 
                        src={message.content} 
                        alt="Generated" 
                        className="max-w-sm rounded-md"
                      />
                    ) : (
                      message.content
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                      <User size={18} color="white" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatViewer;
