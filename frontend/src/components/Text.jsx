import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  SendHorizontal,
  Mic,
  Bot,
  User,
  Loader2,
} from "lucide-react";

const Text = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [streamingMessage, setStreamingMessage] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, streamingMessage]);

  // Speech To Text
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setPrompt((prev) =>
        prev ? prev + " " + transcript : transcript
      );
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  // 🔥 CHATGPT STYLE TYPING FUNCTION
  const typeMessage = (text) => {
    let index = 0;

    setStreamingMessage({ role: "bot", text: "" });

    const interval = setInterval(() => {
      index++;

      setStreamingMessage({
        role: "bot",
        text: text.slice(0, index),
      });

      if (index >= text.length) {
        clearInterval(interval);

        setMessages((prev) => [
          ...prev,
          { role: "bot", text },
        ]);

        setStreamingMessage(null);
      }
    }, 5);
  };

  // Send Message
  const sendPrompt = async () => {
    if (!prompt.trim() || loading) return;

    const userMessage = {
      role: "user",
      text: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentPrompt = prompt;
    setPrompt("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/chat",
        {
          prompt: currentPrompt,
          conversationId: conversationId,
        },
        { withCredentials: true }
      );

      // Set conversation ID from response
      if (res.data.conversationId) {
        setConversationId(res.data.conversationId);
      }

      const botResponse =
        res.data.response ||
        res.data.message ||
        "No response from Gemini";

      // 🚀 START TYPING EFFECT
      typeMessage(botResponse);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Enter Key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt();
    }
  };

  return (
    <div className="h-[calc(100vh-58px)] bg-black flex flex-col">

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scale-100 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <div className="max-w-4xl mx-auto space-y-5">

          {messages.length === 0 && (
            <div className="h-[70vh] flex items-center justify-center text-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-white">
                  How can I help?
                </h1>
                <p className="text-gray-500 mt-2">
                  Ask anything to Gemini
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {msg.role === "bot" && (
                <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                  <Bot size={18} color="white" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm md:text-base whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#1f1f1f] text-white"
                    : "bg-[#181818] text-gray-200"
                }`}
              >
                {msg.text}
              </div>

              {msg.role === "user" && (
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <User size={18} color="white" />
                </div>
              )}
            </div>
          ))}

          {/* 🔥 STREAMING MESSAGE (CHATGPT EFFECT) */}
          {streamingMessage && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center">
                <Bot size={18} color="white" />
              </div>

              <div className="bg-[#181818] rounded-2xl px-4 py-3 text-gray-200">
                {streamingMessage.text}
                <span className="animate-pulse">|</span>
              </div>
            </div>
          )}

          {/* Loading fallback */}
          {loading && !streamingMessage && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center">
                <Bot size={18} color="white" />
              </div>

              <div className="bg-[#181818] rounded-2xl px-4 py-3 text-white flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Gemini is thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-black px-4 pb-5">
        <div className="max-w-4xl mx-auto">

          <div className="bg-[#1a1a1a] rounded-[28px] border border-gray-800 flex items-end px-3 py-2">

            <textarea
              rows={1}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="flex-1 resize-none bg-transparent outline-none text-white px-2 py-2 text-sm md:text-base max-h-40"
            />

            <div className="flex items-center gap-2">

              {/* Mic */}
              <button
                onClick={startListening}
                className={`p-2 rounded-full transition ${
                  listening
                    ? "bg-red-500 text-white"
                    : "hover:bg-[#2a2a2a] text-gray-400"
                }`}
              >
                <Mic size={20} />
              </button>

              {/* Send */}
              <button
                onClick={sendPrompt}
                disabled={loading}
                className="bg-white text-black p-2 rounded-full hover:scale-105 transition disabled:opacity-50"
              >
                <SendHorizontal size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Text;