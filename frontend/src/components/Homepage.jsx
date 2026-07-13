import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LogOut,
  User,
  Sparkles,
  Cpu,
  Image,
  FileSearch,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Zap,
  Layers,
  Infinity as InfinityIcon
} from 'lucide-react'

export default function Homepage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const features = [
    {
      title: 'Text Generation',
      desc: 'Generate human-like copy, blogs, and marketing text using advanced LLMs.',
      icon: Sparkles,
      color: 'from-violet-500 via-indigo-500 to-blue-500',
      path: "/text"
    },
    {
      title: 'Image Synthesis',
      desc: 'Transform plain text prompts into breathtaking, high-fidelity art assets.',
      icon: Image,
      color: 'from-fuchsia-500 via-pink-500 to-rose-500',
      path: "/image"
    },
    {
      title: 'Resume Analyser',
      desc: 'Upload your resume and get detailed analysis with suggestions.',
      icon: FileSearch,
      color: 'from-amber-400 via-orange-500 to-rose-500',
      path: "/resume"
    },
  ]

  const stats = [
    {
      value: '99.99%',
      label: 'Uptime Guaranteed',
      color: 'from-emerald-400 to-cyan-400',
    },
    {
      value: '27ms',
      label: 'Response Time',
      color: 'from-violet-400 to-fuchsia-400',
    },
    {
      value: '4.9/5',
      label: 'User Satisfaction',
      color: 'from-amber-300 to-orange-400',
    },
  ]

  const whyUseIt = [
    {
      title: 'Lightning Fast',
      desc: 'Optimized inference pipelines return results in seconds, not minutes.',
      icon: Zap,
      color: 'from-amber-400 to-fuchsia-500',
    },
    {
      title: 'Enterprise Secure',
      desc: 'Your data is encrypted end-to-end and never used to train external models.',
      icon: ShieldCheck,
      color: 'from-emerald-400 to-cyan-500',
    },
    {
      title: 'One Unified Stack',
      desc: 'Text, image, and document intelligence, all inside a single workspace.',
      icon: Layers,
      color: 'from-indigo-500 to-violet-500',
    },
    {
      title: 'Built to Scale',
      desc: 'From solo experiments to enterprise workloads, without switching tools.',
      icon: InfinityIcon,
      color: 'from-rose-500 to-orange-400',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative font-sans">

      {/* Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-amber-400/5 blur-[100px]" />

      {/* NAVBAR */}
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 flex items-center justify-center">
              <Cpu size={20} />
            </div>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-white via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
              GenAi Workspace
            </span>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            {/* Profile Button */}
            <div
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition hover:bg-white/5"
            >
              {/* Profile Icon */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 flex items-center justify-center text-white text-sm font-medium uppercase">
                {user?.fullName?.charAt(0) || user?.name?.charAt(0) || "G"}
              </div>

              {/* Name Desktop */}
              <span className="hidden md:block text-gray-200 text-sm font-medium">
                {user?.fullName || user?.name || "Loading..."}
              </span>

              <ChevronDown
                size={16}
                className={`hidden md:block text-gray-500 transition-transform duration-200 ${
                  openMenu ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown Menu */}
            {openMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#25252f] border border-white/10 rounded-xl shadow-[0_0_40px_rgba(217,70,239,0.08)] overflow-hidden z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 flex items-center justify-center text-white text-sm font-medium uppercase">
                    {user?.fullName?.charAt(0) || user?.name?.charAt(0) || "G"}
                  </div>

                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {user?.fullName || user?.name || "Loading..."}
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                      {user?.email || "Profile"}
                    </p>
                  </div>
                </div>

              
                {/* Logout */}
                <button
                  onClick={async () => {
                    try {
                      await logout();
                    } catch (err) {
                      console.error("Logout failed:", err);
                    } finally {
                      navigate("/login");
                    }
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-14 relative z-10">

        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1 rounded-full mb-5">
            <Sparkles size={14} className="text-fuchsia-400" />
            <span className="text-xs uppercase tracking-wider bg-gradient-to-r from-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
              Enterprise AI Dashboard
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5">
            Welcome, <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">{user?.fullName || user?.name || 'User'}</span>!
          </h1>

          <p className="text-slate-400 text-base md:text-lg">
            Generate text, images, and resume insights in one unified AI workspace.
          </p>
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

          {features.map((feature, idx) => {
            const Icon = feature.icon

            return (
              <div
                key={idx}
                className="group relative rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 p-7 md:p-8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_0_40px_rgba(217,70,239,0.12)]"
              >

                {/* Glow */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} blur-2xl opacity-0 group-hover:opacity-20 transition`} />

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <Icon size={24} />
                </div>

                {/* Text */}
                <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-fuchsia-300 transition">
                  {feature.title}
                </h3>

                <p className="text-slate-400 mb-8 leading-relaxed">
                  {feature.desc}
                </p>

                {/* Action */}
                <div
                  onClick={() => window.location.href = feature.path}
                  className="flex items-center text-sm text-fuchsia-400 font-semibold cursor-pointer hover:gap-3 transition-all"
                >
                  Explore Module <ArrowRight size={16} className="ml-2" />
                </div>

              </div>
            )
          })}

        </div>

        {/* WHY USE IT */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
              Why Use It
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-3 mb-4">
              Built for teams who move fast
            </h2>
            <p className="text-slate-400">
              A single workspace that replaces a stack of disconnected AI tools, without the usual friction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whyUseIt.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="group relative flex items-start gap-4 rounded-2xl bg-white/[0.02] border-l-2 border-white/10 pl-5 pr-6 py-5 transition-all duration-300 hover:bg-white/[0.05] hover:border-l-fuchsia-400"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold mb-1.5">{item.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* QUALITY GUARANTEES */}
        <div className="mt-24 relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-10 md:p-14 overflow-hidden">

          {/* Top gradient bar — this panel's signature */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400" />

          {/* Glow */}
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-fuchsia-500/10 blur-[100px]" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-amber-400/10 blur-[100px]" />

          <div className="relative text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider text-fuchsia-300 font-semibold">
              Quality Guarantees
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-3">
              Metrics that prove our excellence
            </h2>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-3 divide-y divide-white/10 sm:divide-y-0 sm:divide-x sm:divide-white/10 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="py-6 sm:py-0 sm:px-6 first:pt-0">
                <p className={`text-4xl md:text-5xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </p>
                <p className="text-sm text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

        </div>

      </main>

      {/* FOOTER */}

<footer className="border-t border-white/5 mt-20 bg-black/60 backdrop-blur-xl">
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">

    <div className="flex flex-col gap-10 text-center lg:text-left lg:flex-row lg:items-start lg:justify-between">

      {/* BRAND */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start mx-auto lg:mx-0 max-w-xs sm:max-w-sm lg:max-w-xs shrink-0">

        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 flex items-center justify-center shadow-lg shrink-0">
          <Cpu size={18} />
        </div>

        <div>
          <h4 className="font-semibold text-white text-base">
            GenAi Workspace
          </h4>
          <p className="text-sm text-slate-500 mt-1">
            AI-powered productivity suite for text, image & resume generation.
          </p>
        </div>

      </div>

      {/* LINKS (UI ONLY) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 text-sm mx-auto lg:mx-0 max-w-sm sm:max-w-md w-full lg:w-auto">

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

      {/* STATUS */}
      <div className="flex flex-col items-center gap-3 lg:items-end mx-auto lg:mx-0 shrink-0">

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-300 whitespace-nowrap">All systems operational</span>
        </div>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} GenAi Workspace
        </p>

      </div>

    </div>

    {/* bottom divider glow */}
    <div className="mt-10 h-px bg-gradient-to-r from-transparent via-fuchsia-500/20 to-transparent" />

  </div>
</footer>

    </div>
  )
}