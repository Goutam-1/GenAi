import React, { useEffect, useState } from 'react';
import { User, Bot, Loader2, Download, ImageIcon } from 'lucide-react';
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
          `${import.meta.env.VITE_BASE_API_URL}/conversation/${conversationId}`,
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

  const downloadImage = async (imageUrl, index) => {
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `downloaded-image-${index}.jpeg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
      window.open(imageUrl, '_blank');
    }
  };

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
                  {/* {message.role === 'assistant' && (
                    <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                      <Bot size={18} color="white" />
                    </div>
                  )} */}

                  <div
                    className={`max-w-[85%] rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-[#1f1f1f] text-white px-4 py-3 border border-white/5 text-sm md:text-base whitespace-pre-wrap'
                        : message.content.startsWith('https://image.pollinations.ai')
                          ? '' 
                          : 'bg-[#181818] text-gray-200 px-4 py-3 text-sm md:text-base whitespace-pre-wrap'
                    }`}
                  >
                    {message.content.startsWith('https://image.pollinations.ai') ? (
                      <div className="group bg-[#141414] border border-white/10 rounded-2xl overflow-hidden relative min-h-[250px] max-w-sm transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                        <div className="relative">
                          <img 
                            src={message.content} 
                            alt="Generated AI" 
                            referrerPolicy="no-referrer"
                            className="w-full h-auto object-cover max-h-[400px] block"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <button
                              onClick={() => downloadImage(message.content, idx)}
                              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition transform hover:scale-110 border border-white/10"
                              title="Download Image"
                            >
                              <Download size={20} />
                            </button>
                          </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-t border-white/5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <ImageIcon size={12} className="text-purple-400" />
                            <span>AI Generated Image</span>
                          </div>
                          <button
                            onClick={() => downloadImage(message.content, idx)}
                            className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition"
                            title="Download"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>

                  {/* {message.role === 'user' && (
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                      <User size={18} color="white" />
                    </div>
                  )} */}
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
