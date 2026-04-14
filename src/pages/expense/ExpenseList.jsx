import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [filterStatus, setFilterStatus] = useState("approved");
    const [filterUser, setFilterUser] = useState("");
    const [filterMonth, setFilterMonth] = useState("");
    const [filterYear, setFilterYear] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
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
        fetchExpenses();
        setCategories(fixedCategories); // ✅ Use predefined categories
    }, [filterStatus, filterUser, filterMonth, filterYear, filterCategory]); // ✅ Track changes in filters

    useEffect(() => {
        fetchUsers();
        fetchCategories();
    }, []); // ✅ Users & categories only need to load once

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");
            if (!token) {
                setError("Unauthorized. Please log in.");
                return;
            }
    
            let url = `${import.meta.env.VITE_API_URL}/api/users/expenses/`;
    
            if (role === "user") {
                // ✅ Users only see their own "approved" expenses
                url += `?created_by=${localStorage.getItem("username")}&approval_status=approved`;
            } else if (role === "admin") {
                // ✅ Admins can filter by any status
                url += `?approval_status=${filterStatus}`;
                if (filterUser) url += `&created_by=${filterUser}`;
                if (filterMonth && filterYear) url += `&month=${filterMonth}&year=${filterYear}`;
                if (filterCategory) url += `&category=${filterCategory}`;
            }
    
            const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    
            setExpenses(response.data.expenses || []);
            setTotalExpenses(response.data.total_expenses || 0);
        } catch (error) {
            console.error("🚨 Error fetching expenses:", error);
            setError(error.response?.data?.error || "Failed to load expenses.");
        } finally {
            setLoading(false);
        }
    };
    

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get(import.meta.env.VITE_API_URL +"/api/users/user-list/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error("🚨 Error fetching users:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get(import.meta.env.VITE_API_URL +"/api/categories/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(response.data);
        } catch (error) {
            console.error("🚨 Error fetching categories:", error);
        }
    };

    const handleApproval = async (id, status, e) => {
        e.stopPropagation(); // ✅ Prevents row navigation on button click
        try {
            const token = localStorage.getItem("access_token");
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/users/expenses/${id}/approve-reject/`,
                { approval_status: status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Expense ${status} successfully!`);
            fetchExpenses(); // ✅ Refresh the list after approval/rejection
        } catch (error) {
            console.error("🚨 Error updating approval status:", error);
            alert(error.response?.data?.error || "Failed to update expense.");
        }
    };

    const resetFilters = () => {
        setFilterStatus("approved");
        setFilterUser("");
        setFilterMonth("");
        setFilterYear("");
        setFilterCategory("");
        fetchExpenses(); // ✅ Reload expenses with default filters
    };

    if (loading) return <p>Loading expenses...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Expense List</h2>

            {/* ✅ Total Approved Expenses (Shows correct total for Admins & Users) */}
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-100  shadow-lg rounded-lg text-xl text-gray-800">
                <strong>Total Approved Expenses: </strong>${totalExpenses.toFixed(2)}
            </div>


            {/* ✅ Add Expense Button */}
            {(role === "admin" || role === "user") && (
                <button onClick={() => navigate("/add-expense")} className="bg-green-500 text-white px-6 py-3 rounded-lg mb-4">
                    + Add Expense
                </button>
            )}

            {/* ✅ Filters for Admins */}
            {role === "admin" && (
                <div className="mb-4 flex gap-4 flex-wrap">
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded-lg">
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                        <option value="">All</option>
                    </select>

                    <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)} className="p-2 border rounded-lg">
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.username}>{user.username}</option>
                        ))}
                    </select>

                    <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="p-2 border rounded-lg">
                        <option value="">Select Month</option>
                        {[...Array(12).keys()].map((i) => (
                            <option key={i} value={i + 1}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
                        ))}
                    </select>

                    <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="p-2 border rounded-lg">
                        <option value="">Select Year</option>
                        {[2023, 2024, 2025].map((year) => <option key={year} value={year}>{year}</option>)}
                    </select>

                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="p-2 border rounded-lg">
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    {/* ✅ Reset Button */}
                    <button
                        onClick={resetFilters}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                        🔄 Reset Filters
                    </button>
                </div>
            )}

            {/* ✅ Expense Table */}
            {expenses.length > 0 ? (
                <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="p-4 text-left">Category</th>
                            <th className="p-4 text-left">Amount</th>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses
                            .filter(expense => 
                                role === "admin" ||  // ✅ Admins see all expenses
                                expense.approval_status === "approved" ||  // ✅ Users see approved expenses
                                (role === "user" && expense.created_by_username === localStorage.getItem("username") && expense.approval_status === "pending") // ✅ Users see their own pending expenses
                            )
                            .map((expense) => (
                                <tr key={expense.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/expense/${expense.id}`)}>
                                    <td className="p-4">{expense.category}</td>
                                    <td className="p-4">${expense.amount}</td>
                                    <td className="p-4">{expense.date}</td>

                                    {/* ✅ Dynamic Status Colors */}
                                    <td
                                        className={`p-4 font-bold ${
                                            expense.approval_status === "approved"
                                                ? "text-green-600"
                                                : expense.approval_status === "pending"
                                                ? "text-yellow-500"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {expense.approval_status}
                                    </td>

                                    {/* ✅ Action Buttons (Only Admins Can Approve/Reject) */}
                                    <td className="p-4 flex space-x-2">
                                        {role === "admin" && expense.approval_status === "pending" && (
                                            <>
                                                <button 
                                                    onClick={(e) => handleApproval(expense.id, "approved", e)} 
                                                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                                                >
                                                    ✅ Approve
                                                </button>
                                                <button 
                                                    onClick={(e) => handleApproval(expense.id, "rejected", e)} 
                                                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                                                >
                                                    ❌ Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>

                </table>
            ) : <p className="text-gray-700">No expenses found.</p>}
        </div>
    );
};

export default ExpenseList;
