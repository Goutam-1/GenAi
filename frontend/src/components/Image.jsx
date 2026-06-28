import React, { useState } from "react";
import axios from "axios";
import { ImageIcon, Sparkles, Download, Loader2 } from "lucide-react";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [generatedImage, setGeneratedImage] = useState("");
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim() || loading) return;

    try {
      setLoading(true);
      setHasStarted(true);
      setImgError(false);
      setImgLoading(true);
      setGeneratedImage("");

      // 1. Get the image URL from the backend
      const res = await axios.get("http://localhost:8080/image", {
        params: { 
          prompt,
          conversationId 
        },
        withCredentials: true
      });

      const url = res?.data?.image;
      console.log("Image URL from backend:", url);

      if (!url) {
        throw new Error("No image URL received from backend");
      }

      // Set conversation ID from response
      if (res.data.conversationId) {
        setConversationId(res.data.conversationId);
      }

      // 2. Set the image URL directly so the <img> tag loads it natively (bypassing CORS)
      setGeneratedImage(url);

    } catch (error) {
      console.error("Error fetching image URL:", error);
      setImgError(true);
      setImgLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      generateImage();
    }
  };

  return (
    <div className="h-[calc(100vh-58px)] bg-black text-white flex flex-col">

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scale-100 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <div className="max-w-5xl mx-auto">

          {/* INTRO */}
          {!hasStarted ? (
            <div className="h-[70vh] flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#1a1a1a] flex items-center justify-center border border-white/10 mb-5">
                  <Sparkles size={34} />
                </div>

                <h1 className="text-4xl font-semibold">
                  Generate AI Images
                </h1>

                <p className="text-gray-500 mt-3 text-lg">
                  Describe any image you want to create
                </p>
              </div>
            </div>
          ) : (
            /* IMAGE RESULT */
            <div className="space-y-5">

              {/* IMAGE BOX */}
              <div className="bg-[#181818] border border-white/10 rounded-3xl overflow-hidden relative min-h-[350px] flex items-center justify-center">

                {/* LOADING OVERLAY */}
                {imgLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                    <div className="text-center">
                      <Loader2 className="animate-spin mx-auto mb-2 text-white" size={32} />
                      <p className="text-gray-400 text-sm">Generating AI image...</p>
                    </div>
                  </div>
                )}

                {/* ERROR */}
                {imgError && !imgLoading && (
                  <div className="text-center p-6">
                    <p className="text-red-400 mb-2">Failed to load image</p>
                    <p className="text-gray-500 text-xs max-w-md">
                      The image generation service may be busy or blocked. Please try again.
                    </p>
                  </div>
                )}

                {/* IMAGE */}
                {generatedImage && !imgError && (
                  <img
                    key={generatedImage}
                    src={generatedImage}
                    alt="Generated AI"
                    referrerPolicy="no-referrer"
                    className={`w-full max-h-[70vh] object-cover transition-opacity duration-500 ${imgLoading ? "opacity-0" : "opacity-100"
                      }`}
                    onLoad={() => {
                      console.log("Image loaded successfully natively");
                      setImgLoading(false);
                    }}
                    onError={() => {
                      console.log("Image failed to load natively");
                      setImgLoading(false);
                      setImgError(true);
                    }}
                  />
                )}
              </div>

              {/* DOWNLOAD */}
              {!imgError && generatedImage && (
                <div className="flex justify-end">
                  <a
                    href={generatedImage}
                    download
                    className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-medium hover:scale-105 transition"
                  >
                    <Download size={18} />
                    Download
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* INPUT */}
      <div className="sticky bottom-0 bg-black px-4 pb-5">
        <div className="max-w-5xl mx-auto">

          <div className="bg-black rounded-[30px] border border-white/10 flex items-center px-3 py-3">

            <div className="px-2 text-gray-400">
              <ImageIcon size={22} />
            </div>

            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the image you want to generate..."
              className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-500 px-2"
            />

            <button
              onClick={generateImage}
              disabled={loading}
              className="bg-white text-black p-3 rounded-full hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Sparkles size={20} />
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;