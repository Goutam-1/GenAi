import React from 'react';
import { Trash2, MessageSquare, Image as ImageIcon, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HistoryItem = ({ conversation, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation?')) {
      try {
        await axios.delete(
          `http://localhost:8080/conversation/${conversation._id}`,
          { withCredentials: true }
        );
        onDelete(conversation._id);
      } catch (error) {
        console.error('Error deleting conversation:', error);
      }
    }
  };

  const handleClick = () => {
    navigate(`/history/${conversation._id}`);
  };

  const getIcon = () => {
    switch (conversation.featureType) {
      case 'text':
        return <MessageSquare size={16} className="text-blue-400" />;
      case 'image':
        return <ImageIcon size={16} className="text-purple-400" />;
      case 'resume':
        return <FileText size={16} className="text-green-400" />;
      default:
        return <MessageSquare size={16} className="text-gray-400" />;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1a1a1a] cursor-pointer transition-colors border border-transparent hover:border-white/10"
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-300 truncate font-medium">
          {conversation.title}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(conversation.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default HistoryItem;
