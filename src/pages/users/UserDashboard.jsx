import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const UserDashboard = () => {
    const [summary, setSummary] = useState({
        total_paid: 0,
        total_pending_amount: 0,
        total_pending_invoices: 0,
        total_expenses: 0
    });
    const [invoices, setInvoices] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]); // ✅ Store Chart Data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserDashboardData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    setError("Unauthorized. Please log in.");
                    return;
                }
    
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get(import.meta.env.VITE_API_URL +"/api/users/user-dashboard/", { headers });
    
                console.log("API Response:", response.data);
    
                setSummary(response.data.summary || {
                    total_paid: 0,
                    total_pending_amount: 0,
                    total_pending_invoices: 0,
                    total_expenses: 0
                });
                setInvoices(response.data.invoices || []);
                setExpenses(response.data.expenses || []);
                setMonthlyData(response.data.monthly_data || []); // ✅ Set Chart Data
            } catch (error) {
                console.error("Error fetching user dashboard data:", error);
    
                if (error.response) {
                    console.log("Server Response:", error.response.data);
                    setError(error.response.data.error || "Failed to load user dashboard.");
                } else {
                    setError("Failed to connect to server.");
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserDashboardData();
    }, []);

    if (loading) return <p className="text-center text-gray-600">Loading user dashboard...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex-1 p-6 space-y-8">
                <h2 className="text-2xl font-bold">User Dashboard</h2>

                {/* Summary Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Paid Invoices", value: summary.total_paid, bg: "bg-green-500" },
                        { label: "Total Pending Invoice Amount", value: summary.total_pending_amount, bg: "bg-yellow-500" },
                        { label: "Total Pending Invoices", value: summary.total_pending_invoices, bg: "bg-blue-500" },
                        { label: "Total Expenses", value: summary.total_expenses, bg: "bg-red-500" },
                    ].map((item, index) => (
                        <div key={index} className={`rounded-lg p-4 text-white ${item.bg}`}>
                            <h3 className="text-lg font-medium">{item.label}</h3>
                            <p className="text-2xl font-bold mt-2">{item.value.toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                {/* 📊 Invoice vs Expense Chart */}
                <div className="bg-white p-6 shadow-md rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Invoices vs Expenses (Last 6 Months)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="invoices" fill="#4CAF50" name="Invoices" />
                            <Bar dataKey="expenses" fill="#FF5733" name="Expenses" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Invoices Section */}
                <div className="bg-white p-6 shadow-md rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Your Assigned Invoices</h3>
                    {invoices.length === 0 ? (
                        <p className="text-gray-500">No invoices assigned.</p>
                    ) : (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2">Invoice #</th>
                                    <th className="border p-2">Client</th>
                                    <th className="border p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="text-center border-t">
                                        <td className="border p-2">{invoice.invoice_number}</td>
                                        <td className="border p-2">{invoice.client__name}</td>
                                        <td className={`border p-2 ${invoice.status === "paid" ? "text-green-600" : "text-red-600"}`}>
                                            {invoice.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Expenses Section */}
                <div className="bg-white p-6 shadow-md rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Your Recent Expenses</h3>
                    {expenses.length === 0 ? (
                        <p className="text-gray-500">No recent expenses.</p>
                    ) : (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2">Category</th>
                                    <th className="border p-2">Amount</th>
                                    <th className="border p-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense) => (
                                    <tr key={expense.id} className="text-center border-t">
                                        <td className="border p-2">{expense.category}</td>
                                        <td className="border p-2">${expense.amount.toFixed(2)}</td>
                                        <td className="border p-2">{expense.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
