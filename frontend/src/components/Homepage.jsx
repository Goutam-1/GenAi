import React from 'react'
import { useAuth } from '../context/AuthContext'
import {
  LogOut,
  User,
  Sparkles,
  Cpu,
  Image,
  FileSearch,
  ArrowRight,
  Mic
} from 'lucide-react'

export default function Homepage() {
  const { user, logout } = useAuth()

  const features = [
    {
      title: 'Text Generation',
      desc: 'Generate human-like copy, blogs, and marketing text using advanced LLMs.',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-500',
      path: "/text"
    },
    {
      title: 'Image Synthesis',
      desc: 'Transform plain text prompts into breathtaking, high-fidelity art assets.',
      icon: Image,
      color: 'from-pink-500 to-rose-500',
      path: "/image"
    },
    {
      title: 'Resume Analyser',
      desc: 'Upload your resume and get detailed analysis with suggestions.',
      icon: FileSearch,
      color: 'from-blue-500 to-cyan-500',
      path: "/resume"
    },
    {
      title: 'Voice Assistant',
      desc: 'Interact with the AI using your voice for coding and assistance.',
      icon: Mic,
      color: 'from-emerald-500 to-teal-500',
      path: "/voice"
    },
  ]

  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-hidden relative font-sans">

      {/* Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />

      {/* NAVBAR */}
      <nav className="border-b border-white/5 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Cpu size={20} />
            </div>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              GenAi Workspace
            </span>
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-4">

            <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10 max-w-[180px] md:max-w-[250px]">
              <User size={14} className="text-blue-400" />
              <span className="text-sm text-slate-300 truncate">
                {user?.fullName || user?.email}
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white px-4 py-2 rounded-xl transition"
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-14 relative z-10">

        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1 rounded-full mb-5">
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-xs uppercase tracking-wider text-blue-300">
              Enterprise AI Dashboard
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5">
            Welcome, {user?.fullName || 'User'}!
          </h1>

          <p className="text-slate-400 text-base md:text-lg">
            Generate text, images, resumes, and voice interactions in one unified AI workspace.
          </p>
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {features.map((feature, idx) => {
            const Icon = feature.icon

            return (
              <div
                key={idx}
                className="group relative rounded-3xl bg-slate-900/40 hover:bg-slate-900/60 border border-white/5 p-7 md:p-8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_0_40px_rgba(59,130,246,0.12)]"
              >

                {/* Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition" />

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <Icon size={24} />
                </div>

                {/* Text */}
                <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-blue-400 transition">
                  {feature.title}
                </h3>

                <p className="text-slate-400 mb-8 leading-relaxed">
                  {feature.desc}
                </p>

                {/* Action */}
                <div
                  onClick={() => window.location.href = feature.path}
                  className="flex items-center text-sm text-blue-400 font-semibold cursor-pointer hover:gap-3 transition-all"
                >
                  Explore Module <ArrowRight size={16} className="ml-2" />
                </div>

              </div>
            )
          })}

        </div>
      </main>

      {/* FOOTER */}

<footer className="border-t border-white/5 mt-20 bg-[#0B1220]/60 backdrop-blur-xl">
  <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">

    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

      {/* LEFT - BRAND */}
      <div className="flex items-start gap-4">

        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Cpu size={18} />
        </div>

        <div>
          <h4 className="font-semibold text-white text-base">
            GenAi Workspace
          </h4>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            AI-powered productivity suite for text, image, resume & voice generation.
          </p>
        </div>

      </div>

      {/* CENTER - LINKS (UI ONLY) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">

        <div className="space-y-2">
          <p className="text-slate-400 font-medium">Product</p>
          <p className="text-slate-500 hover:text-white cursor-pointer">Dashboard</p>
          <p className="text-slate-500 hover:text-white cursor-pointer">Features</p>
          <p className="text-slate-500 hover:text-white cursor-pointer">Pricing</p>
        </div>

        <div className="space-y-2">
          <p className="text-slate-400 font-medium">Resources</p>
          <p className="text-slate-500 hover:text-white cursor-pointer">Docs</p>
          <p className="text-slate-500 hover:text-white cursor-pointer">API</p>
          <p className="text-slate-500 hover:text-white cursor-pointer">Support</p>
        </div>

        <div className="space-y-2">
          <p className="text-slate-400 font-medium">Company</p>
          <p className="text-slate-500 hover:text-white cursor-pointer">About</p>
          <p className="text-slate-500 hover:text-white cursor-pointer">Privacy</p>
          <p className="text-slate-500 hover:text-white cursor-pointer">Terms</p>
        </div>

      </div>

      {/* RIGHT - STATUS */}
      <div className="flex flex-col items-start md:items-end gap-3">

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-slate-300">All systems operational</span>
        </div>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} GenAi Workspace
        </p>

      </div>

    </div>

    {/* bottom divider glow */}
    <div className="mt-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

  </div>
</footer>

    </div>
  )
}