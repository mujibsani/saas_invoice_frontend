import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // ✅ Load stored credentials if "Remember Me" was checked before
    useEffect(() => {
        const storedUsername = localStorage.getItem("remembered_username");
        const storedPassword = localStorage.getItem("remembered_password");
        if (storedUsername && storedPassword) {
            setFormData({ username: storedUsername, password: storedPassword });
            setRememberMe(true);
        }
    }, []);

    // ✅ Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle Login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/users/login/", formData);
            if (response.status === 200) {
                const { access, refresh, username, email, role, tenant_name } = response.data;

                // ✅ Store tokens & user info in localStorage
                localStorage.setItem("access_token", access);
                localStorage.setItem("refresh_token", refresh);
                localStorage.setItem("username", username);
                localStorage.setItem("email", email);
                localStorage.setItem("role", role);
                localStorage.setItem("tenant_name", tenant_name);

                // ✅ Save credentials if "Remember Me" is checked
                if (rememberMe) {
                    localStorage.setItem("remembered_username", formData.username);
                    localStorage.setItem("remembered_password", formData.password);
                } else {
                    localStorage.removeItem("remembered_username");
                    localStorage.removeItem("remembered_password");
                }

                // ✅ Update Auth State Immediately (Triggers Sidebar Update)
                onLogin(); 

                // ✅ Redirect based on user role
                navigate(role === "admin" ? "/dashboard" : "/user-dashboard");
            }
        } catch (error) {
            setError("Invalid username or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen justify-center items-center bg-gray-100">
            <div className="bg-white p-6 shadow-md rounded-lg w-96">
                <h2 className="text-2xl font-semibold mb-4">Login</h2>

                {error && <p className="text-red-500">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {/* ✅ Username Input */}
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full mb-3 p-2 border rounded"
                    />

                    {/* ✅ Password Input with Toggle */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full mb-3 p-2 border rounded pr-10"
                        />
                        <button
                            type="button"
                            className="absolute top-2 right-2 text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁"}
                        </button>
                    </div>

                    {/* ✅ Remember Me Checkbox */}
                    <div className="flex items-center mb-3">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="mr-2"
                        />
                        <label htmlFor="rememberMe">Remember Me</label>
                    </div>

                    {/* ✅ Submit Button */}
                    <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* ✅ Redirect to Register */}
                <div className="mt-4 text-center">
                    <p>
                        Don't have an account?{" "}
                        <button onClick={() => navigate("/register")} className="text-blue-600 hover:underline">
                            Create Account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
