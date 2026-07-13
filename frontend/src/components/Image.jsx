import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ImageIcon,
  Sparkles,
  Download,
  Loader2,
  User,
  Bot,
  AlertCircle
} from "lucide-react";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const messagesEndRef = useRef(null);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversation from localStorage on mount
  useEffect(() => {
    const savedConvId = localStorage.getItem("active_image_conversation_id");
    if (savedConvId) {
      loadConversation(savedConvId);
    } else {
      setCheckingSession(false);
    }
  }, []);

  const loadConversation = async (convId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/conversation/${convId}`, {
        withCredentials: true
      });
      if (res.data && res.data.messages) {
        setConversationId(convId);
        const formatted = [];
        res.data.messages.forEach((msg, idx) => {
          if (msg.role === "user") {
            formatted.push({
              id: msg._id || `user-${idx}`,
              role: "user",
              content: msg.content
            });
          } else {
            const prevUserMsg = res.data.messages.slice(0, idx).reverse().find(m => m.role === "user");
            formatted.push({
              id: msg._id || `assistant-${idx}`,
              role: "assistant",
              content: msg.content,
              prompt: prevUserMsg ? prevUserMsg.content : "AI Generated Image",
              loading: false,
              imgLoading: false,
              error: false
            });
          }
        });
        setMessages(formatted);
        setHasStarted(true);
      }
    } catch (err) {
      console.error("Error loading saved conversation:", err);
      localStorage.removeItem("active_image_conversation_id");
    } finally {
      setLoading(false);
      setCheckingSession(false);
    }
  };



  const generateImage = async (customPrompt = null) => {
    const activePrompt = customPrompt !== null ? customPrompt : prompt;
    if (!activePrompt.trim() || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `assistant-${Date.now()}`;

    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: "user", content: activePrompt },
      { id: assistantMsgId, role: "assistant", content: "", prompt: activePrompt, loading: true, imgLoading: false, error: false }
    ]);
    setPrompt("");
    setHasStarted(true);

    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/image`, {
        params: {
          prompt: activePrompt,
          conversationId
        },
        withCredentials: true
      });

      const url = res?.data?.image;
      if (!url) {
        throw new Error("No image URL received from backend");
      }

      if (res.data.conversationId) {
        setConversationId(res.data.conversationId);
        localStorage.setItem("active_image_conversation_id", res.data.conversationId);
      }

      setMessages(prev => prev.map(msg => {
        if (msg.id === assistantMsgId) {
          return { ...msg, content: url, loading: false, imgLoading: true };
        }
        return msg;
      }));

    } catch (error) {
      console.error("Error fetching image URL:", error);
      setMessages(prev => prev.map(msg => {
        if (msg.id === assistantMsgId) {
          return { ...msg, loading: false, imgLoading: false, error: true };
        }
        return msg;
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  };

  const downloadImage = async (imageUrl, originalPrompt) => {
    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const cleanPrompt = originalPrompt
        ? originalPrompt.trim().substring(0, 30).replace(/[^a-z0-9]/gi, "_").toLowerCase()
        : "generated-image";
      link.download = `${cleanPrompt}.jpeg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
      window.open(imageUrl, "_blank");
    }
  };

  const SUGGESTIONS = [
    { text: "A futuristic cyberpunk city street under neon rain", icon: "🏙️" },
    { text: "A majestic glowing forest with mythical creatures", icon: "🌲" },
    { text: "Astronaut playing guitar on the moon, digital art", icon: "👩‍🚀" },
    { text: "Hyper-realistic cute orange cat wearing round glasses", icon: "🐱" },
  ];

  if (checkingSession) {
    return (
      <div className="h-[calc(100vh-58px)] bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-58px)] bg-black text-white flex flex-col relative">

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scale-100 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* INTRO */}
          {!hasStarted ? (
            <div className="h-[75vh] flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6">
                <Sparkles size={28} className="text-white" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                Generate AI Images
              </h1>

              <p className="text-gray-400 mt-3 text-sm md:text-base">
                Describe the image you want to create. Each generation will create a unique, high-resolution visual art piece.
              </p>

              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 w-full">
                {SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => generateImage(sug.text)}
                    className="flex items-center gap-3 p-4 bg-[#141414] hover:bg-[#1f1f1f] border border-white/5 hover:border-purple-500/30 rounded-xl text-left transition duration-200 group text-sm"
                  >
                    <span className="text-2xl group-hover:scale-110 transition">{sug.icon}</span>
                    <span className="text-gray-300 font-medium leading-snug">{sug.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* MESSAGES THREAD */
            <div className="space-y-6">
              {messages.map((msg) => {
                if (msg.role === "user") {
                  return (
                    <div key={msg.id} className="flex gap-3 justify-end">
                      <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm md:text-base bg-[#1f1f1f] text-white border border-white/5">
                        {msg.content}
                      </div>
                      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-md">
                        <User size={18} color="white" />
                      </div>
                    </div>
                  );
                } else {
                  const isImageLoading = msg.loading || msg.imgLoading;
                  return (
                    <div key={msg.id} className="flex gap-3 justify-start">
                      <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center shrink-0 shadow-md">
                        <Bot size={18} color="white" />
                      </div>

                      <div className="flex-1 max-w-[85%]">
                        <div className="group bg-[#141414] border border-white/10 rounded-2xl overflow-hidden relative min-h-[300px] max-w-lg transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]">

                          {/* Image rendering */}
                          {msg.content && !msg.error && (
                            <div className="relative">
                              <img
                                src={msg.content}
                                alt={msg.prompt}
                                referrerPolicy="no-referrer"
                                className={`w-full h-auto object-cover max-h-[500px] block transition-opacity duration-300 ${isImageLoading ? "opacity-0" : "opacity-100"
                                  }`}
                                onLoad={() => {
                                  setMessages(prev => prev.map(m => {
                                    if (m.id === msg.id) {
                                      return { ...m, imgLoading: false };
                                    }
                                    return m;
                                  }));
                                }}
                                onError={() => {
                                  setMessages(prev => prev.map(m => {
                                    if (m.id === msg.id) {
                                      return { ...m, imgLoading: false, error: true };
                                    }
                                    return m;
                                  }));
                                }}
                              />

                              {/* Hover actions overlay */}
                              {!isImageLoading && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                                  <button
                                    onClick={() => downloadImage(msg.content, msg.prompt)}
                                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition transform hover:scale-110 border border-white/10"
                                    title="Download Image"
                                  >
                                    <Download size={20} />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Loader */}
                          {isImageLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 p-4">
                              <Loader2 className="animate-spin text-purple-500 mb-3" size={32} />
                              <p className="text-gray-400 text-sm font-medium animate-pulse">
                                {msg.loading ? "Generating AI image..." : "Loading image..."}
                              </p>
                            </div>
                          )}

                          {/* Error block */}
                          {msg.error && !isImageLoading && (
                            <div className="p-6 text-center flex flex-col items-center justify-center min-h-[300px]">
                              <AlertCircle className="text-red-500 mb-2" size={32} />
                              <p className="text-red-400 font-medium mb-1">Failed to generate image</p>
                              <p className="text-gray-500 text-xs max-w-sm mb-4">
                                The service might be overloaded or the prompt was filtered.
                              </p>
                              <button
                                onClick={() => generateImage(msg.prompt)}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition"
                              >
                                Try Again
                              </button>
                            </div>
                          )}

                          {/* Actions Bar */}
                          {msg.content && !isImageLoading && !msg.error && (
                            <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-t border-white/5">
                              <span className="text-xs text-gray-500 truncate max-w-[300px]" title={msg.prompt}>
                                Prompt: {msg.prompt}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => downloadImage(msg.content, msg.prompt)}
                                  className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition"
                                  title="Download"
                                >
                                  <Download size={15} />
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* INPUT */}
      <div className="sticky bottom-0 bg-black px-4 pb-5 pt-2 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#141414] rounded-2xl border border-white/10 flex items-center px-4 py-3 focus-within:border-purple-500/40 transition">

            <div className="pr-3 text-gray-500">
              <ImageIcon size={20} />
            </div>

            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the image you want to generate..."
              className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-500 text-sm md:text-base"
            />

            <button
              onClick={() => generateImage()}
              disabled={loading || !prompt.trim()}
              className="bg-white text-black p-2.5 rounded-xl hover:scale-105 transition disabled:opacity-30 disabled:hover:scale-100 ml-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Sparkles size={18} />
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ImageGenerator;