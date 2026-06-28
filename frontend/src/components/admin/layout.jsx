import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeft,
  Menu,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-xl shadow-lg border border-gray-100"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static top-0 left-0 z-50
            h-screen w-72
            bg-white border-r border-gray-100
            shadow-2xl lg:shadow-none
            transition-transform duration-300 ease-in-out
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          {/* Header */}
          <div className="h-16 border-b border-gray-100 flex items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>

              <div>
                <h2 className="font-bold text-lg text-gray-800">
                  Admin Panel
                </h2>
                <p className="text-xs text-gray-500">
                  Management Dashboard
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            <Link
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl
              bg-blue-50 text-blue-600 font-medium
              hover:bg-blue-100 transition"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>

            <div className="border-t border-gray-100 my-4"></div>

            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl
              text-gray-600 hover:bg-gray-100
              transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </nav>

         
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-screen overflow-y-auto p-4 sm:p-6 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>


    </div>
  );
}