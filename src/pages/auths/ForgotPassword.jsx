import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await api.post("forgot-password/", { email });
            setMessage("Password reset email sent. Check your inbox.");
        } catch (error) {
            setMessage("Failed to send reset email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>
                {message && <p className="text-red-500 text-center mb-3">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Email"}
                    </button>
                </form>
                <div className="mt-4 text-sm text-center">
                    Remembered your password?{" "}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Log in
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
