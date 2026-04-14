import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddExpense = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: "",
        amount: "",
        description: "",
        date: "",
        approval_status: "pending",
    });
    const [tenantId, setTenantId] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ✅ Fixed Categories List (No Custom Input for "Other")
    const fixedCategories = [
        "Office Supplies",
        "Travel",
        "Utilities",
        "Salary",
        "Marketing",
        "Rent",
        "Convense",
        "Day-Allowance",
        "Other",
    ];

    // ✅ Fetch Tenant Info & Role
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const userRole = localStorage.getItem("role");
                setRole(userRole);

                if (!token) throw new Error("Unauthorized. Please log in.");

                const response = await axios.get("http://127.0.0.1:8000/api/users/tenant-info/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTenantId(response.data.id);
                localStorage.setItem("tenant_id", response.data.id);
            } catch (error) {
                console.error("🚨 Error fetching tenant info:", error);
                setError("Failed to fetch tenant information.");
            }
        };

        fetchUserInfo();
    }, []);

    // ✅ Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle Expense Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("access_token");
            if (!tenantId) throw new Error("Tenant ID is missing. Please log in again.");

            const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

            if (!formData.category) {
                setError("Please select a category.");
                setLoading(false);
                return;
            }

            const expenseData = {
                category: formData.category,  // ✅ Just store the selected category
                amount: parseFloat(formData.amount),
                description: formData.description,
                date: formData.date,
                tenant: tenantId,
                approval_status: role === "admin" ? "approved" : "pending",
            };

            console.log("🚀 Sending Expense Data:", expenseData);

            await axios.post("http://127.0.0.1:8000/api/users/expenses/", expenseData, { headers });

            alert("Expense added successfully!");
            navigate("/expenses");

        } catch (error) {
            console.error("🚨 Failed to add expense:", error.response ? error.response.data : error.message);
            setError(error.response?.data?.error || "Failed to add expense. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Add Expense</h2>

                {error && <p className="text-red-500">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Expense Category */}
                    <label>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                        required
                    >
                        <option value="">Select Category</option>
                        {fixedCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    {/* Expense Amount */}
                    <label>Amount ($)</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        className="p-2 border rounded w-full"
                    />

                    {/* Expense Description */}
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                        rows="3"
                    ></textarea>

                    {/* Expense Date */}
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="p-2 border rounded w-full"
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? "Adding Expense..." : "Add Expense"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddExpense;
