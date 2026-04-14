import { useEffect, useState } from "react";
import axios from "axios";

const ApproveExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");
            const headers = { Authorization: `Bearer ${token}` };

            const response = await axios.get("http://127.0.0.1:8000/api/users/expenses/", { headers });

            // ✅ Filter only pending expenses
            const pendingExpenses = response.data.filter(expense => expense.approval_status === "pending");
            setExpenses(pendingExpenses);
        } catch (error) {
            console.error("🚨 Error fetching expenses:", error);
            setError(error.response?.data?.error || "Failed to load expenses.");
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (expenseId, status) => {
        try {
            const token = localStorage.getItem("access_token");
            const headers = { Authorization: `Bearer ${token}` };

            await axios.patch(
                `http://127.0.0.1:8000/api/users/expenses/${expenseId}/approve-reject/`,
                { approval_status: status },
                { headers }
            );

            alert(`Expense ${status} successfully!`);
            fetchExpenses(); // ✅ Refresh the list after update
        } catch (error) {
            console.error("🚨 Error updating expense:", error);
            alert(error.response?.data?.error || "Failed to update expense.");
        }
    };

    if (loading) return <p className="text-center text-gray-600">Loading expenses...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (expenses.length === 0) return <p className="text-center text-gray-600">No pending expenses to review.</p>;

    return (
        <div className="flex">
            <div className="flex-1 p-6 space-y-8">
                <h2 className="text-2xl font-bold">Approve Expenses</h2>

                <table className="w-full bg-white shadow-md rounded">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left">Category</th>
                            <th className="p-3 text-left">Amount</th>
                            <th className="p-3 text-left">Description</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(expense => (
                            <tr key={expense.id} className="border-b">
                                <td className="p-3">{expense.category}</td>
                                <td className="p-3">${expense.amount.toFixed(2)}</td>
                                <td className="p-3">{expense.description}</td>
                                <td className="p-3">{expense.date}</td>
                                <td className="p-3 flex space-x-2">
                                    <button
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                        onClick={() => handleApproval(expense.id, "approved")}
                                    >
                                        ✅ Approve
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        onClick={() => handleApproval(expense.id, "rejected")}
                                    >
                                        ❌ Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApproveExpenses;
