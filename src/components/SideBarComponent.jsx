import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiHome, FiSettings, FiLogOut, FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const role = localStorage.getItem("role") || "user";
  const username = localStorage.getItem("username") || "Guest";
  const tenantName = localStorage.getItem("tenant_name") || "My Company";

  useEffect(() => {
    const fetchTenantInfo = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(import.meta.env.VITE_API_URL + "/api/users/tenant-info/", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // Ensure full URL
        const fullLogoUrl = response.data.logo
          ? `${import.meta.env.VITE_API_URL}${response.data.logo}`
          : null;
  
        console.log("Logo URL: ", fullLogoUrl);
        setLogoUrl(fullLogoUrl);
      } catch (error) {
        console.error("Failed to fetch tenant info:", error);
      }
    };
  
    fetchTenantInfo();
  }, []);
  

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/api/users/notifications/unread-count/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        setUnreadCount(response.data.unread_count);
      } catch (error) {
        console.error("Error fetching notifications count:", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 50000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL +"/api/users/notifications/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      setNotifications(response.data);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) fetchNotifications();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (route) => {
    setIsOpen(false);
    navigate(route);
  };

  const handleLogout = () => {
    ["access_token", "refresh_token", "username", "email", "role", "tenant_name"].forEach((item) =>
      localStorage.removeItem(item)
    );
    window.dispatchEvent(new Event("storage"));
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-gray-800 bg-white p-2 rounded-full shadow-md"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)}></div>}

      <div className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white shadow-lg transform z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:relative flex flex-col justify-between`}>
        
        {/* Sidebar Header */}
        <div className="p-4 flex flex-col items-center relative">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Tenant Logo"
            className="h-16 w-auto rounded-lg shadow-md mb-2"
            onError={(e) => {
              console.error("Image failed to load:", logoUrl);
              e.target.src = "/default-logo.png"; // Fallback logo
            }}
          />
        ) : (
          <p>Loading logo...</p>
        )}
          <h2 className="text-lg font-bold text-green-500 text-center">
            {tenantName} <br /> {role?.toUpperCase()}: {username}
          </h2>

          {/* Notification Bell */}
          {/* Notification Bell */}
          <div className="relative mt-3">
            <button onClick={toggleDropdown} className="relative text-white">
              <FiBell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
              {/* {console.log("sidebar: ", role)} */}
            {/* Notification Dropdown - Positioned to the Right */}
            {isDropdownOpen && role === "user" &&(
              <div
                ref={dropdownRef}
                className="absolute left-full top-0 ml-2 w-64 bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden z-50"
              >
                <div className="p-2 text-center font-bold bg-gray-700">Notifications</div>
                {notifications.length === 0 ? (
                  <div className="p-3 text-gray-300 text-center">No new notifications</div>
                ) : (
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.map((notif, index) => (
                      <div key={index} className="p-2 border-b border-gray-700 text-sm">
                        {notif.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Menu */}
        <ul className="space-y-4 px-4">
          <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer" onClick={() => handleNavigate(role === "admin" ? "/dashboard" : "/user-dashboard")}>
            <FiHome size={20} /> <span>Dashboard</span>
          </li>
          <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer" onClick={() => handleNavigate("/invoices")}>
            <span>Invoices</span>
          </li>
          <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer" onClick={() => handleNavigate("/expenses")}>
            <span>Expenses</span>
          </li>
          {/* <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer" onClick={() => handleNavigate("/tasks")}>
            <span>Task</span>
          </li> */}
          {role === "admin" && (
            <>
              <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer" onClick={() => handleNavigate("/users")}>
                <span>Users</span>
              </li>
              <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer" onClick={() => handleNavigate("/clients")}>
                <span>Clients</span>
              </li>
            </>
          )}
          <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer" onClick={() => handleNavigate("/settings")}>
            <FiSettings size={20} /> <span>Settings</span>
          </li>
        </ul>

        {/* Logout */}
        <div className="px-4 mb-4">
          <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer" onClick={handleLogout}>
            <FiLogOut size={20} /> <span>Logout</span>
          </li>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
