import React, { useState, useEffect } from "react";
import {
  SquarePen,
  ChevronLeft,
  ChevronDown,
  Menu,
  Image as ImageIcon,
  FileText,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HistoryItem from "../components/sidebar/HistoryItem";
import { useSidebar } from "../context/SidebarContext";

const Sidebar = () => {
  const { open, setOpen } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false); // mobile only
  const [textHistory, setTextHistory] = useState([]);
  const [imageHistory, setImageHistory] = useState([]);
  const [resumeHistory, setResumeHistory] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    text: true,
    image: true,
    resume: true
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const [textRes, imageRes, resumeRes] = await Promise.all([
        axios.get("http://localhost:8080/conversations/text", { withCredentials: true }),
        axios.get("http://localhost:8080/conversations/image", { withCredentials: true }),
        axios.get("http://localhost:8080/conversations/resume", { withCredentials: true })
      ]);
      
      setTextHistory(textRes.data);
      setImageHistory(imageRes.data);
      setResumeHistory(resumeRes.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDeleteHistory = (id, section) => {
    if (section === 'text') {
      setTextHistory(prev => prev.filter(conv => conv._id !== id));
    } else if (section === 'image') {
      setImageHistory(prev => prev.filter(conv => conv._id !== id));
    } else if (section === 'resume') {
      setResumeHistory(prev => prev.filter(conv => conv._id !== id));
    }
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full p-3 scroll-thin">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        {(open || isMobile) && (
          <h1 className="text-white text-lg font-semibold">GenAi</h1>
        )}
        {!isMobile && (
          <button
            onClick={() => setOpen(!open)}
            className={`text-gray-300 hover:text-white hover:bg-[#1a1a1a] p-2 rounded-lg ${open ? '' : 'mx-auto'}`}
          >
            {open ? (
              <ChevronLeft size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        )}
      </div>

      {/* New Chat */}
      <button
        onClick={() => {
          if (isMobile) setMobileOpen(false);
          if (window.location.pathname === "/text") {
            window.location.reload();
          } else {
            navigate("/text");
          }
        }}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white hover:bg-[#1a1a1a] mb-4"
      >
        <SquarePen size={20} />
        {(open || isMobile) && <span>New Chat</span>}
      </button>

      {/* History Sections */}
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {/* Text History */}
        <div>
          <button
            onClick={() => toggleSection('text')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1a1a1a] text-sm font-medium transition-colors ${
              open || isMobile ? 'text-gray-300' : 'text-gray-500'
            }`}
          >
            <MessageSquare size={16} />
            {(open || isMobile) && (
              <>
                <span>Text History</span>
                <ChevronDown
                  size={16}
                  className={`ml-auto transition-transform ${
                    expandedSections.text ? 'rotate-180' : ''
                  }`}
                />
              </>
            )}
          </button>
          {expandedSections.text && (open || isMobile) && (
            <div className="space-y-1 mt-2">
              {textHistory.length === 0 ? (
                <p className="text-xs text-gray-500 px-3 py-2">No conversations</p>
              ) : (
                textHistory.slice(0, 10).map(conv => (
                  <HistoryItem
                    key={conv._id}
                    conversation={conv}
                    onDelete={() => handleDeleteHistory(conv._id, 'text')}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Image History */}
        <div>
          <button
            onClick={() => toggleSection('image')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1a1a1a] text-sm font-medium transition-colors ${
              open || isMobile ? 'text-gray-300' : 'text-gray-500'
            }`}
          >
            <ImageIcon size={16} />
            {(open || isMobile) && (
              <>
                <span>Image History</span>
                <ChevronDown
                  size={16}
                  className={`ml-auto transition-transform ${
                    expandedSections.image ? 'rotate-180' : ''
                  }`}
                />
              </>
            )}
          </button>
          {expandedSections.image && (open || isMobile) && (
            <div className="space-y-1 mt-2">
              {imageHistory.length === 0 ? (
                <p className="text-xs text-gray-500 px-3 py-2">No conversations</p>
              ) : (
                imageHistory.slice(0, 10).map(conv => (
                  <HistoryItem
                    key={conv._id}
                    conversation={conv}
                    onDelete={() => handleDeleteHistory(conv._id, 'image')}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Resume History */}
        <div>
          <button
            onClick={() => toggleSection('resume')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1a1a1a] text-sm font-medium transition-colors ${
              open || isMobile ? 'text-gray-300' : 'text-gray-500'
            }`}
          >
            <FileText size={16} />
            {(open || isMobile) && (
              <>
                <span>Resume History</span>
                <ChevronDown
                  size={16}
                  className={`ml-auto transition-transform ${
                    expandedSections.resume ? 'rotate-180' : ''
                  }`}
                />
              </>
            )}
          </button>
          {expandedSections.resume && (open || isMobile) && (
            <div className="space-y-1 mt-2">
              {resumeHistory.length === 0 ? (
                <p className="text-xs text-gray-500 px-3 py-2">No conversations</p>
              ) : (
                resumeHistory.slice(0, 10).map(conv => (
                  <HistoryItem
                    key={conv._id}
                    conversation={conv}
                    onDelete={() => handleDeleteHistory(conv._id, 'resume')}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ================= MOBILE MENU BUTTON ================= */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg"
      >
        <Menu size={22} />
      </button>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <div
        className={`hidden md:flex h-screen bg-[#111111] overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "w-64 lg:w-72" : "w-[70px]"
        }`}
      >
        <aside
          className={`
            z-50 h-screen bg-black border-r border-white/6
            transition-all duration-300 ease-in-out
            ${open ? "w-64 lg:w-72" : "w-17.5"}
            overflow-hidden
          `}
        >
          <SidebarContent />
        </aside>
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden transition-all duration-300 ease-in-out"
            onClick={() => setMobileOpen(false)}
          />

          {/* Sidebar */}
          <aside className="fixed top-0 left-0 z-50 h-screen w-64 bg-black border-r border-white/10 md:hidden overflow-y-auto">
            <SidebarContent isMobile={true} />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;

//export default Sidebar;