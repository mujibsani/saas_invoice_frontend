import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditExpense = () => {
    const { id } = useParams(); // Get expense ID from URL
    const navigate = useNavigate();

    const [tenantId, setTenantId] = useState(""); // Store tenant ID
    const [formData, setFormData] = useState({
        category: "",
        amount: "",
        description: "",
        date: "",
        tenant: ""  // Ensure tenant is included before submitting
    });

    // ✅ Fixed Categories List
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

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        // ✅ Fetch Expense Details
        axios.get(`${import.meta.env.VITE_API_URL}/api/users/expenses/${id}/`, { headers })
            .then((res) => {
                const expense = res.data;
                setFormData({
                    category: expense.category,
                    amount: expense.amount,
                    description: expense.description,
                    date: expense.date,
                    tenant: expense.tenant // Ensure the tenant ID is included
                });
            })
            .catch((error) => console.error("🚨 Error fetching expense:", error));

        // ✅ Fetch Tenant Info
        axios.get(import.meta.env.VITE_API_URL +"/api/users/tenant-info/", { headers })
            .then((res) => {
                setTenantId(res.data.id);
                setFormData(prev => ({ ...prev, tenant: res.data.id })); // Update formData with tenant ID
            })
            .catch((error) => console.error("🚨 Error fetching tenant info:", error));
    }, [id]);

    // ✅ Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Submit Edited Expense
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        console.log("🚀 Submitting updated expense data:", formData);

        axios.put(`${import.meta.env.VITE_API_URL}/api/users/expenses/${id}/`, formData, { headers })
            .then(() => {
                alert("✅ Expense updated successfully!");
                navigate("/expenses");
            })
            .catch((error) => {
                console.error("🚨 Error updating expense:", error);
                alert("⚠️ Failed to update expense.");
            });
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Edit Expense</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Hidden Tenant ID */}
                    <input type="hidden" name="tenant" value={tenantId} />

                    {/* ✅ Category (Dropdown) */}
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

                    {/* Amount */}
                    <label>Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        className="p-2 border rounded w-full"
                    />

                    {/* Description */}
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="p-2 border rounded w-full"
                        rows="3"
                    ></textarea>

                    {/* Date */}
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
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">
                        Update Expense
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditExpense;
