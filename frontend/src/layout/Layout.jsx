import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../context/SidebarContext";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-[#111111] overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <Header />

          {/* FIX: Removed overflow-y-auto so the view container stays rigid */}
          <main className="flex-1 min-h-0 bg-black text-white relative">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;