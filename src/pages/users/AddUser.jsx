import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddUserForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "user", // Default role
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [emailAvailable, setEmailAvailable] = useState(null);
    const [emailValid, setEmailValid] = useState(true); // ✅ Tracks email format validity
    const navigate = useNavigate();

    // ✅ Check username availability in real-time
    const checkUsername = async (username) => {
        if (!username) return;
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/check-username/?username=${username}`);
            setUsernameAvailable(!response.data.exists);
        } catch (error) {
            console.error("Username check error:", error);
        }
    };

    // ✅ Validate email format
    const validateEmailFormat = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email format
        return emailRegex.test(email);
    };

    // ✅ Check email availability when user finishes typing (onBlur)
    const checkEmail = async () => {
        const email = formData.email;
        if (!email) return;

        // Validate email format before making an API request
        if (!validateEmailFormat(email)) {
            setEmailValid(false);
            setEmailAvailable(null); // Reset availability check
            return;
        } else {
            setEmailValid(true);
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/check-email/?email=${email}`);
            setEmailAvailable(!response.data.exists);
        } catch (error) {
            console.error("Email check error:", error);
        }
    };

    // ✅ Handle Input Change & Trigger Username Check
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "username") checkUsername(value);
    };

    // ✅ Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!usernameAvailable || !emailAvailable || !emailValid) {
            setMessage("❌ Please fix the errors before submitting.");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("access_token");
            await axios.post(import.meta.env.VITE_API_URL +"/api/users/add-user/", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessage("✅ User added successfully!");
            setFormData({ username: "", email: "", password: "", role: "user" });
            setUsernameAvailable(null);
            setEmailAvailable(null);
            setEmailValid(true);
            navigate("/users");

        } catch (error) {
            setMessage("❌ Error adding user.");
        } finally {
            setLoading(false);
            
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Add User</h2>

                {message && <p className={`mb-4 text-sm ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>{message}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Username Field with Real-Time Availability Check */}
                    <div className="mb-3">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                        {usernameAvailable !== null && (
                            <p className={`text-sm mt-1 ${usernameAvailable ? "text-green-500" : "text-red-500"}`}>
                                {usernameAvailable ? "✅ Username is available" : "❌ Username is taken"}
                            </p>
                        )}
                    </div>

                    {/* Email Field with Format Validation & Availability Check on Blur */}
                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={checkEmail} // ✅ Check when user stops typing
                            required
                            className="w-full p-2 border rounded"
                        />
                        {!emailValid && (
                            <p className="text-sm text-red-500 mt-1">❌ Invalid email format</p>
                        )}
                        {emailAvailable !== null && emailValid && (
                            <p className={`text-sm mt-1 ${emailAvailable ? "text-green-500" : "text-red-500"}`}>
                                {emailAvailable ? "✅ Email is available" : "❌ Email is already registered"}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full mb-3 p-2 border rounded"
                    />

                    {/* Role Selection Dropdown */}
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full mb-3 p-2 border rounded"
                    >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="accountant">Accountant</option>
                        <option value="user">User</option>
                    </select>

                    {/* Submit Button */}
                    <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        {loading ? "Adding..." : "Add User"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddUserForm;
