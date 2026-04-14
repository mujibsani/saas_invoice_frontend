import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // ✅ Fetch Users and Update State
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");
            const response = await axios.get(import.meta.env.VITE_API_URL +"/api/users/user-list/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            setError("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch users on page load & auto-refresh every 10 seconds
    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 1000000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);

    // ✅ Toggle User Status
    const handleToggleStatus = async (userId, isActive, userRole) => {
        if (userRole === "admin") {
            alert("Admin users cannot be deactivated!");
            return;
        }

        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.post(
                `http://127.0.0.1:8000/api/users/toggle-user-status/${userId}/`, 
                {}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // ✅ Update user status immediately in UI
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, is_active: !isActive } : user
                )
            );

            alert(response.data.message); // Show success message
        } catch (error) {
            alert("Failed to change user status.");
        }
    };

    // ✅ Delete User
    const handleDelete = async (userId, userRole) => {
        if (userRole === "admin") {
            alert("Admin users cannot be deleted!");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`http://127.0.0.1:8000/api/users/delete-user/${userId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUsers(users.filter((user) => user.id !== userId)); // Remove from UI instantly
        } catch (error) {
            alert("Failed to delete user.");
        }
    };

    // ✅ Reset User Password
    const handleResetPassword = async (userId, username) => {
        const newPassword = prompt(`Enter a new password for ${username}:`);
        if (!newPassword) return;

        try {
            const token = localStorage.getItem("access_token");
            await axios.post(
                `http://127.0.0.1:8000/api/users/reset-password/${userId}/`, 
                { user_id: userId, new_password: newPassword }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Password reset successfully!");
        } catch (error) {
            alert("Failed to reset password.");
        }
    };

    return (
        <div className="flex">
            <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">User List</h2>
                    <button
                        onClick={() => navigate("/add-user")}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        + Add User
                    </button>
                </div>

                {error && <p className="text-red-500">{error}</p>}
                {loading ? (
                    <p>Loading users...</p>
                ) : users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Username</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Role</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="text-center border-t">
                                    <td className="border p-2">{user.username}</td>
                                    <td className="border p-2">{user.email}</td>
                                    <td className="border p-2">{user.role}</td>
                                    <td className="border p-2">
                                        <span className={user.is_active ? "text-green-600" : "text-red-600"}>
                                            {user.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="border p-2 space-x-2">
                                        {/* ✅ Toggle Active/Inactive for Non-Admin Users */}
                                        {user.role !== "admin" && (
                                            <button
                                                onClick={() => handleToggleStatus(user.id, user.is_active, user.role)}
                                                className={`px-3 py-1 rounded ${
                                                    user.is_active 
                                                        ? "bg-yellow-500 hover:bg-yellow-600 text-white" 
                                                        : "bg-green-500 hover:bg-green-600 text-white"
                                                }`}
                                            >
                                                {user.is_active ? "Deactivate" : "Activate"}
                                            </button>
                                        )}
                                        
                                        {/* ✅ Delete Button (Disabled for Admin Users) */}
                                        {user.role !== "admin" && (
                                            <button
                                                onClick={() => handleDelete(user.id, user.role)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        )}

                                        {/* ✅ Reset Password Button */}
                                        {user.role !== "admin" && (
                                            <button
                                                onClick={() => handleResetPassword(user.id, user.username)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Reset Password
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UserList;
