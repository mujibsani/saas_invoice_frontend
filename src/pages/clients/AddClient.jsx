import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddClient = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        details: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // ✅ Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem("access_token");
            await axios.post("http://127.0.0.1:8000/api/users/clients/", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            setMessage("✅ Client added successfully!");
            setFormData({ name: "", email: "", phone: "", address: "", details: ""});

            // ✅ Redirect to Client List after successful addition
            setTimeout(() => {
                navigate("/clients");
            }, 1500);
        } catch (error) {
            setMessage("❌ Error adding client.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-center">Add Client</h2>

                {message && <p className={`mb-4 text-center text-sm ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Client Name */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Client Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />

                    {/* Phone */}
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />

                    {/* Address */}
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />

                    {/* Description */}
                    <textarea
                        name="details"
                        placeholder="Details"
                        value={formData.details}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        rows="3"
                    ></textarea>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {loading ? "Adding..." : "Add Client"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddClient;
