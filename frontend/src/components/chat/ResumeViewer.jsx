import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  ChevronDown,
  ChevronUp,
  Award,
  TrendingUp,
} from 'lucide-react';

const ResumeViewer = ({ analysis }) => {
  const [expandedSections, setExpandedSections] = useState({
    strengths: true,
    weaknesses: true,
    suggestions: true,
    keywords: true,
    formatting: true,
  });
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score counter
  useEffect(() => {
    if (analysis?.atsScore != null) {
      const target = analysis.atsScore;
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
  }, [analysis?.atsScore]);

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
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

  const scoreColor = analysis ? getScoreColor(analysis.atsScore) : {};
  const scoreLabel = analysis ? getScoreLabel(analysis.atsScore) : {};

  // SVG gauge
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const scorePercent = analysis ? animatedScore / 100 : 0;
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
    <div className="w-full max-w-4xl mx-auto">
      {/* Score Card */}
      <div
        className={`relative overflow-hidden rounded-2xl border ${scoreColor.border} ${scoreColor.bg} p-6 md:p-8 mb-6`}
      >
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
      {analysis.summary && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6 mb-6">
          <h3 className="text-white font-semibold text-base mb-3">Summary</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{analysis.summary}</p>
        </div>
      )}

      {/* Detail Sections */}
      {["strengths", "weaknesses", "suggestions", "keywords", "formatting"].map((key) => {
        const items = analysis[key];
        if (!items || items.length === 0) return null;
        const isExpanded = expandedSections[key] !== false;
        const colors = sectionColors[key];

        return (
          <div
            key={key}
            className={`rounded-2xl border ${colors.border} ${colors.bg} overflow-hidden mb-4`}
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
    </div>
  );
};

export default ResumeViewer;
