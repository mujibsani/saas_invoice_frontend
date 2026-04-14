import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ExpenseDetails = () => {
    const { id } = useParams(); // Get expense ID from URL
    const [expense, setExpense] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    setError("Unauthorized. Please log in.");
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/expenses/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("✅ Expense Data:", response.data);
                setExpense(response.data);
            } catch (error) {
                console.error("🚨 Error fetching expense:", error);
                setError("Failed to load expense details.");
            } finally {
                setLoading(false);
            }
        };

        fetchExpense();
    }, [id]);

    // ✅ Delete Expense
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;

        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/expenses/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Expense deleted successfully!");
            navigate("/expenses"); // Redirect back to expense list
        } catch (error) {
            alert("Failed to delete expense.");
        }
    };

    if (loading) return <p>Loading expense details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="flex">
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4">Expense Details</h2>

                <div className="bg-white shadow-md rounded p-6">
                    <p><strong>Category:</strong> {expense.category}</p>
                    <p><strong>Amount:</strong> ${expense.amount}</p>
                    <p><strong>Description:</strong> {expense.description || "No description"}</p>
                    <p><strong>Date:</strong> {expense.date}</p>
                    <p><strong>Tenant:</strong> {expense.tenant_name}</p>

                    {/* ✅ Buttons Section */}
                    <div className="flex space-x-4 mt-4">
                        {role === "admin" && (
                            <>
                                <button 
                                    onClick={() => navigate(`/edit-expense/${id}`)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Edit Expense
                                </button>

                                <button 
                                    onClick={handleDelete}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Delete Expense
                                </button>
                            </>
                        )}
                    </div>

                    <button 
                        onClick={() => navigate("/expenses")}
                        className="mt-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Back to Expenses
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseDetails;
