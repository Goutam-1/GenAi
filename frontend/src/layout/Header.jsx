import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ChevronDown, LogOut } from "lucide-react";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const menuRef = useRef(null);

  // Verify API Call
useEffect(() => {
  const verifyUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/verify",
        {
          withCredentials: true,
        }
      );

      setUser({
        name: res.data.fullName,
        email: res.data.email,
      });

    } catch (error) {
      console.log("Verify Error:", error);
    }
  };

  verifyUser();
}, []);


  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <header className="w-full bg-black border-b border-white/5 px-4 md:px-5 py-2 flex justify-end items-center h-14.5">
      <div className="relative" ref={menuRef}>
        {/* Profile Button */}
        <div
          onClick={() => setOpenMenu(!openMenu)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition hover:bg-white/5"
        >
          {/* Profile Icon */}
          <div className="w-9 h-9 rounded-full bg-green-950 flex items-center justify-center text-white text-sm font-medium uppercase">
            {user?.name?.charAt(0) || "G"}
          </div>

          {/* Name Desktop */}
          <span className="hidden md:block text-gray-200 text-sm font-medium">
            {user?.name || "Loading..."}
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
          <div className="absolute right-0 mt-2 w-56 bg-[#161616] border border-white/10 rounded-xl shadow-lg overflow-hidden z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-950 flex items-center justify-center text-white text-sm font-medium uppercase">
                {user?.name?.charAt(0) || "G"}
              </div>

              <div>
                <p className="text-white text-sm font-medium">
                  {user?.name || "Loading..."}
                </p>
                <p className="text-gray-500 text-xs">
                  Profile
                </p>
              </div>
            </div>

            {/* Logout */}
            <button className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition ">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;