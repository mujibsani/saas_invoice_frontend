import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bell } from "lucide-react"; // Importing an icon for better UI

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch unread count
    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_API_URL +"/api/users/notifications/unread-count/", {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
            });
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    };

    // Fetch notifications and mark as read
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_API_URL +"/api/users/notifications/", {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
            });
            setNotifications(response.data);
            setUnreadCount(0); // Reset unread count after viewing
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
    }, []);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    fetchNotifications();
                }}
                className="relative p-3 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700 transition duration-300"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-4 border-b font-semibold text-gray-700">
                        Notifications
                    </div>
                    <ul className="max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <li
                                    key={notif.id}
                                    className="px-4 py-3 border-b hover:bg-gray-100 transition"
                                >
                                    {notif.message}
                                </li>
                            ))
                        ) : (
                            <li className="p-4 text-gray-500 text-center">
                                No new notifications
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Notifications;
