import { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
    const [user, setUser] = useState({ username: "", email: "" });
    const [passwordData, setPasswordData] = useState({ old_password: "", new_password: "" });
    const [tenant, setTenant] = useState({ domain: "", logo: null }); // ✅ Prevent name change
    const [logoPreview, setLogoPreview] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const role = localStorage.getItem("role");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get(import.meta.env.VITE_API_URL +"/api/users/profile/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                setError("Failed to fetch user profile.");
            }
        };

        const fetchTenantInfo = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get("http://127.0.0.1:8000/api/users/tenant-info/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // ✅ Convert relative path to full URL
                const fullLogoUrl = response.data.logo ? `http://127.0.0.1:8000${response.data.logo}` : null;

                setTenant({ domain: response.data.domain, logo: fullLogoUrl });
                setLogoPreview(fullLogoUrl); // ✅ Set preview correctly
            } catch (error) {
                setError("Failed to fetch tenant info.");
            }
        };

        fetchUserProfile();
        if (role === "admin") {
            fetchTenantInfo();
        }
    }, [role]);

    // Handle Input Change
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setTenant({ ...tenant, logo: file });

        if (file) {
            const reader = new FileReader();
            reader.onload = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Update Profile
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("access_token");
            await axios.put("http://127.0.0.1:8000/api/users/profile/", user, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessage("Profile updated successfully!");
        } catch (error) {
            setError("Failed to update profile.");
        }
    };

    // Change Password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("access_token");
            await axios.post("http://127.0.0.1:8000/api/users/change-password/", passwordData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessage("Password updated successfully!");
        } catch (error) {
            setError("Failed to change password.");
        }
    };

    // Update Tenant Info (Only Logo)
    const handleUpdateTenant = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("access_token");
            const formData = new FormData();
            if (tenant.logo) formData.append("logo", tenant.logo); // ✅ Only update logo

            await axios.put("http://127.0.0.1:8000/api/users/tenant/update/", formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });

            setMessage("Tenant updated successfully!");
        } catch (error) {
            setError("Failed to update tenant.");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>

                {message && <p className="text-green-500">{message}</p>}
                {error && <p className="text-red-500">{error}</p>}

                {/* Update Profile Form */}
                <form onSubmit={handleUpdateProfile} className="space-y-4 bg-white p-6 shadow-md rounded">
                    <h3 className="text-xl font-semibold">Update Profile</h3>

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                    />

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Update Profile
                    </button>
                </form>

                {/* Change Password Form */}
                <form onSubmit={handleChangePassword} className="space-y-4 bg-white p-6 shadow-md rounded mt-6">
                    <h3 className="text-xl font-semibold">Change Password</h3>

                    <label>Old Password</label>
                    <input
                        type="password"
                        name="old_password"
                        value={passwordData.old_password}
                        onChange={handlePasswordChange}
                        className="p-2 border rounded w-full"
                    />

                    <label>New Password</label>
                    <input
                        type="password"
                        name="new_password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        className="p-2 border rounded w-full"
                    />

                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                        Change Password
                    </button>
                </form>

                {/* Admin Only: Tenant Settings */}
                {role === "admin" && (
                    <form onSubmit={handleUpdateTenant} className="mt-6 bg-white p-6 shadow-md rounded">
                        <h3 className="text-xl font-semibold">Tenant Settings (Admin Only)</h3>

                        <label>Domain</label>
                        <input
                            type="text"
                            name="domain"
                            value={tenant.domain}
                            disabled
                            className="p-2 border rounded w-full bg-gray-200 cursor-not-allowed"
                        />

                        <label>Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="p-2 border rounded w-full"
                        />

                        {/* ✅ Show logo preview if available */}
                        {logoPreview ? (
                            <img
                                src={logoPreview}
                                alt="Tenant Logo"
                                className="h-20 w-auto mt-3 rounded-lg shadow-md"
                                onError={(e) => (e.target.src = "/default-logo.png")} // ✅ Fallback image
                            />
                        ) : (
                            <p className="text-gray-500 mt-2">No logo uploaded</p>
                        )}

                        <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded mt-4">
                            Update Logo
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Settings;
