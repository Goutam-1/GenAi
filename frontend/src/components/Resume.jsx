import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Gauge,
  Lightbulb,
  Target,
  Award,
  X,
} from "lucide-react";

const Resume = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});
  const [animatedScore, setAnimatedScore] = useState(0);
  const [conversationId, setConversationId] = useState(null);
  const fileInputRef = useRef(null);
  const resultRef = useRef(null);

  // Animate score counter
  useEffect(() => {
    if (result?.atsScore != null) {
      const target = result.atsScore;
      let current = 0;
      const duration = 1500;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedScore(Math.round(current));
      }, 16);
      return () => clearInterval(timer);
    }
  }, [result?.atsScore]);

  // Animate steps appearing one by one
  useEffect(() => {
    if (result && visibleSteps < 5) {
      const timer = setTimeout(() => {
        setVisibleSteps((prev) => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [result, visibleSteps]);

  // Scroll to results
  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [result]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      setError("");
    } else {
      setError("Only PDF files are accepted");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Only PDF files are accepted");
    }
  };

  const removeFile = () => {
    setFile(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError("");
    setVisibleSteps(0);
    setAnimatedScore(0);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post("http://localhost:8080/analyze-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      
      // Set conversation ID from response
      if (res.data.conversationId) {
        setConversationId(res.data.conversationId);
      }
      
      setResult(res.data);

    } catch (err) {
      console.error(err);
      const detailedError = err.response?.data?.error || err.message || "Failed to analyze resume. Please try again.";
      setError(detailedError);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError("");
    setVisibleSteps(0);
    setAnimatedScore(0);
    setExpandedSections({});
    setConversationId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", stroke: "#34d399" };
    if (score >= 60) return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", stroke: "#fbbf24" };
    return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", stroke: "#f87171" };
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return { label: "Excellent", icon: <Award size={18} />, desc: "Your resume is well-optimized for ATS systems" };
    if (score >= 60) return { label: "Good", icon: <TrendingUp size={18} />, desc: "Your resume needs some improvements" };
    return { label: "Needs Work", icon: <AlertTriangle size={18} />, desc: "Significant improvements recommended" };
  };

  const scoreColor = result ? getScoreColor(result.atsScore) : {};
  const scoreLabel = result ? getScoreLabel(result.atsScore) : {};

  // SVG gauge
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const scorePercent = result ? animatedScore / 100 : 0;
  const dashOffset = circumference - scorePercent * circumference;

  const sectionIcons = {
    strengths: <CheckCircle2 size={20} className="text-emerald-400" />,
    weaknesses: <AlertTriangle size={20} className="text-amber-400" />,
    suggestions: <Lightbulb size={20} className="text-violet-400" />,
    keywords: <Target size={20} className="text-cyan-400" />,
  };

  const sectionColors = {
    strengths: { bg: "bg-emerald-500/5", border: "border-emerald-500/20", dot: "bg-emerald-400" },
    weaknesses: { bg: "bg-amber-500/5", border: "border-amber-500/20", dot: "bg-amber-400" },
    suggestions: { bg: "bg-violet-500/5", border: "border-violet-500/20", dot: "bg-violet-400" },
    keywords: { bg: "bg-cyan-500/5", border: "border-cyan-500/20", dot: "bg-cyan-400" },
    formatting: { bg: "bg-rose-500/5", border: "border-rose-500/20", dot: "bg-rose-400" },
  };

  const sectionTitles = {
    strengths: "Strengths",
    weaknesses: "Areas to Improve",
    suggestions: "Suggestions",
    keywords: "Missing Keywords",
    formatting: "Formatting Tips",
  };

  return (
    <div className="min-h-[calc(100vh-58px)] bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-5 tracking-wide">
            <Sparkles size={14} />
            AI-POWERED ANALYSIS
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Resume <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Analyzer</span>
          </h1>
          <p className="text-gray-500 mt-3 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Upload your resume and get an instant ATS compatibility score with actionable suggestions to improve your chances.
          </p>
        </div>

        {/* Upload Section */}
        {!result && (
          <div className="max-w-2xl mx-auto">
            {/* Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
              className={`
                relative group rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
                ${dragActive
                  ? "border-violet-400 bg-violet-500/5 scale-[1.01]"
                  : file
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />

              {!file ? (
                <div className="flex flex-col items-center justify-center py-16 md:py-20 px-6">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300
                    ${dragActive ? "bg-violet-500/20 scale-110" : "bg-white/5 group-hover:bg-white/10"}
                  `}>
                    <Upload size={28} className={`transition-colors duration-300 ${dragActive ? "text-violet-400" : "text-gray-500 group-hover:text-gray-400"}`} />
                  </div>
                  <p className="text-white font-medium text-base md:text-lg mb-1">
                    Drop your resume here
                  </p>
                  <p className="text-gray-500 text-sm mb-5">
                    or click to browse files
                  </p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-gray-500 text-xs">
                    <FileText size={13} />
                    PDF format only
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between py-6 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <FileText size={22} className="text-violet-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate max-w-[200px] sm:max-w-xs">
                        {file.name}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {(file.size / 1024).toFixed(1)} KB • PDF
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(); }}
                    className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <XCircle size={16} className="text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={`
                w-full mt-5 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2.5
                ${!file || loading
                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98]"
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing your resume...
                </>
              ) : (
                <>
                  <Gauge size={18} />
                  Analyze Resume
                </>
              )}
            </button>

            {/* Loading Steps */}
            {loading && (
              <div className="mt-8 space-y-3">
                {["Extracting text from PDF...", "Analyzing content with AI...", "Computing ATS score..."].map((step, i) => (
                  <LoadingStep key={i} text={step} delay={i * 1200} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div ref={resultRef} className="space-y-6 animate-in">

            {/* Score Card */}
            <div className={`
              relative overflow-hidden rounded-2xl border ${scoreColor.border} ${scoreColor.bg} p-6 md:p-8
            `}>
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" className={scoreColor.text} />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.3" className={scoreColor.text} />
                  <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.2" className={scoreColor.text} />
                </svg>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Circular Score Gauge */}
                <div className="relative shrink-0">
                  <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
                    {/* Background circle */}
                    <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    {/* Score arc */}
                    <circle
                      cx="90"
                      cy="90"
                      r={radius}
                      fill="none"
                      stroke={scoreColor.stroke}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${scoreColor.text}`}>{animatedScore}</span>
                    <span className="text-gray-500 text-xs mt-0.5">/ 100</span>
                  </div>
                </div>

                {/* Score Info */}
                <div className="text-center md:text-left flex-1">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${scoreColor.bg} border ${scoreColor.border} ${scoreColor.text} text-sm font-medium mb-3`}>
                    {scoreLabel.icon}
                    {scoreLabel.label}
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">
                    ATS Compatibility Score
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {scoreLabel.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            {result.summary && (
              <div
                className={`rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6 transition-all duration-500 ${visibleSteps >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <h3 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-violet-400" />
                  Summary
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{result.summary}</p>
              </div>
            )}

            {/* Detail Sections */}
            {["strengths", "weaknesses", "suggestions", "keywords", "formatting"].map((key, index) => {
              const items = result[key];
              if (!items || items.length === 0) return null;
              const stepIndex = index + 1;
              const isVisible = visibleSteps >= stepIndex;
              const isExpanded = expandedSections[key] !== false; // default expanded
              const colors = sectionColors[key];

              return (
                <div
                  key={key}
                  className={`rounded-2xl border ${colors.border} ${colors.bg} overflow-hidden transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                  <button
                    onClick={() => toggleSection(key)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left group"
                  >
                    <div className="flex items-center gap-3">
                      {sectionIcons[key]}
                      <h3 className="text-white font-semibold text-base">
                        {sectionTitles[key]}
                      </h3>
                      <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                        {items.length}
                      </span>
                    </div>
                    <div className="text-gray-500 group-hover:text-gray-400 transition-colors">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-2.5">
                      {items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 py-2.5 px-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${colors.dot} mt-2 shrink-0`} />
                          <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Reset Button */}
            <div className="flex justify-center pt-4 pb-8">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm font-medium"
              >
                <RotateCcw size={16} />
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS animations */}
      <style>{`
        .animate-in > * {
          animation: slideUp 0.5s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// Loading step sub-component
const LoadingStep = ({ text, delay }) => {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), delay);
    const doneTimer = setTimeout(() => setDone(true), delay + 1000);
    return () => { clearTimeout(showTimer); clearTimeout(doneTimer); };
  }, [delay]);

  if (!visible) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
      {done ? (
        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
      ) : (
        <Loader2 size={16} className="animate-spin text-violet-400 shrink-0" />
      )}
      <span className={`text-sm ${done ? "text-gray-400" : "text-gray-300"}`}>{text}</span>
    </div>
  );
};

export default Resume;
