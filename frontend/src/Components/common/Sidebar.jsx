import React, { useState } from "react";
import Logowomen from "../../assets/HabituraCropLogo.png";
import { useCookies } from "react-cookie";
import { FaBars, FaTimes } from "react-icons/fa"; 

const Sidebar = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]); 
  const [isSidebarOpen, setSidebarOpen] = useState(false); 

  const logout = () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (confirm) {
      removeCookie("token", { path: "/" });
      // window.location.href = "/"; 
    } else {
      return;
    }
  };

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Hamburger menu icon for small screens */}
      <div className="lg:hidden p-4">
        <button onClick={toggleSidebar} className="text-darkgreen">
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`h-full mt-12 lg:mt-0 w-64 bg-darkgreen text-white flex flex-col fixed lg:static z-50 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo or Brand */}
        <a href="/">
          <div className="flex justify-center items-center cursor-pointer z-10 space-x-2 px-8 py-3">
            <img
              src={Logowomen}
              alt="Habitura logo"
              height={50}
              width={50}
              className="rounded-full"
            />
            <div className="text-4xl text-coolsecondary font-logo font-light mt-3">
              Habitura
            </div>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="flex-1 px-4">
          <ul>
            <li className="py-2">
              <a
                href="/dashboard"
                className="block px-4 py-2 hover:bg-darkestgreen rounded"
              >
                Dashboard
              </a>
            </li>
            <li className="py-2">
              <a
                href="/myHabits"
                className="block px-4 py-2 hover:bg-darkestgreen rounded"
              >
                My Habits
              </a>
            </li>
            <li className="py-2">
              <a
                href="/my-profile"
                className="block px-4 py-2 hover:bg-darkestgreen rounded"
              >
                My Profile
              </a>
            </li>
            <li className="py-2">
              <a
                href="settings"
                className="block px-4 py-2 hover:bg-darkestgreen rounded"
              >
                Settings
              </a>
            </li>
            <li className="py-2">
              <a
                href="#"
                className="block px-4 py-2 hover:bg-darkestgreen rounded"
                onClick={logout}
              >
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay to close the sidebar when clicking outside*/}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
