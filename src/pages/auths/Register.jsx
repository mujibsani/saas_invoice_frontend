import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        business_name: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [usernameExists, setUsernameExists] = useState(null);
    const [emailExists, setEmailExists] = useState(null);
    const [tenantExists, setTenantExists] = useState(null);
    const navigate = useNavigate();

    // ✅ Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Check Username Availability (Debounced)
    useEffect(() => {
        if (!formData.username) {
            setUsernameExists(null);
            return;
        }

        const delay = setTimeout(async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/users/check-username/?username=${formData.username}`);
                setUsernameExists(response.data.exists);
            } catch (error) {
                console.error("Error checking username:", error);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [formData.username]);

    // ✅ Check Email Availability (Debounced)
    useEffect(() => {
        if (!formData.email) {
            setEmailExists(null);
            return;
        }

        const delay = setTimeout(async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/users/check-email/?email=${formData.email}`);
                setEmailExists(response.data.exists);
            } catch (error) {
                console.error("Error checking email:", error);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [formData.email]);

    // ✅ Check Tenant Name Availability (Debounced)
    useEffect(() => {
        if (!formData.business_name) {
            setTenantExists(null);
            return;
        }

        const delay = setTimeout(async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/users/check-tenant/?tenant_name=${formData.business_name}`);
                setTenantExists(response.data.exists);
            } catch (error) {
                console.error("Error checking tenant name:", error);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [formData.business_name]);

    // ✅ Handle Registration
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // ✅ Validate Password Match
        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/users/register/", formData, {
                headers: { "Content-Type": "application/json" }
            });

            setMessage("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setMessage(error.response?.data?.error || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
                {message && <p className="text-red-500 text-center mb-3">{message}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ✅ Username */}
                    <div className="relative">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                        {usernameExists !== null && (
                            <p className={`text-sm ${usernameExists ? "text-red-500" : "text-green-500"}`}>
                                {usernameExists ? "❌ Username is taken" : "✅ Username is available"}
                            </p>
                        )}
                    </div>

                    {/* ✅ Email */}
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                        {emailExists !== null && (
                            <p className={`text-sm ${emailExists ? "text-red-500" : "text-green-500"}`}>
                                {emailExists ? "❌ Email is already in use" : "✅ Email is available"}
                            </p>
                        )}
                    </div>

                    {/* ✅ Password with Toggle */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded pr-10"
                        />
                        <button
                            type="button"
                            className="absolute top-2 right-2 text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁"}
                        </button>
                    </div>

                    {/* ✅ Confirm Password with Toggle */}
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded pr-10"
                        />
                        <button
                            type="button"
                            className="absolute top-2 right-2 text-gray-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? "🙈" : "👁"}
                        </button>
                    </div>

                    {/* ✅ Business Name (Tenant Name Check) */}
                    <div className="relative">
                        <input
                            type="text"
                            name="business_name"
                            placeholder="Business Name"
                            value={formData.business_name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                        {tenantExists !== null && (
                            <p className={`text-sm ${tenantExists ? "text-red-500" : "text-green-500"}`}>
                                {tenantExists ? "❌ Business name is taken" : "✅ Business name is available"}
                            </p>
                        )}
                    </div>

                    {/* ✅ Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                        disabled={loading || usernameExists || emailExists || tenantExists}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                {/* ✅ Redirect to Login */}
                <div className="mt-4 text-sm text-center">
                    Already have an account?{" "}
                    <button onClick={() => navigate("/login")} className="text-blue-500 hover:underline">
                        Log in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
