import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Fetch User's Dashboard Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const role = localStorage.getItem("role");

                // Redirect Admins to Admin Dashboard
                if (role === "admin") {
                    navigate("/dashboard");
                    return;
                }

                if (!token) {
                    setError("Unauthorized. Please log in.");
                    navigate("/login");
                    return;
                }

                const response = await axios.get(import.meta.env.VITE_API_URL +"/api/users/client-dashboard/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setData(response.data);
            } catch (err) {
                setError("Failed to load dashboard data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* <Sidebar /> */}
            <div className="flex-1 p-6 space-y-8">
                {/* Dashboard Heading */}
                <h2 className="text-2xl font-bold text-gray-800">Client Dashboard</h2>

                {/* Financial Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { label: "Total Pending", value: `$${data.total_pending}`, bg: "bg-blue-500" },
                        { label: "Total Expenses", value: `$${data.total_expenses}`, bg: "bg-red-500" },
                        { label: "Total Paid", value: `$${data.total_paid}`, bg: "bg-green-500" },
                    ].map((item, index) => (
                        <div key={index} className={`rounded-lg p-4 text-white ${item.bg}`}>
                            <h3 className="text-lg font-medium">{item.label}</h3>
                            <p className="text-2xl font-bold mt-2">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Invoices */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4">Recent Invoices</h3>
                    <ul className="divide-y divide-gray-200">
                        {data.recent_invoices.length > 0 ? (
                            data.recent_invoices.map((invoice) => (
                                <li key={invoice.id} className="flex justify-between py-3">
                                    <span>{invoice.invoice_number}</span>
                                    <span className="font-semibold">${invoice.amount}</span>
                                    <span className={invoice.status === "Paid" ? "text-green-600" : "text-red-600"}>
                                        {invoice.status}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">No recent invoices.</p>
                        )}
                    </ul>
                </div>

                {/* Recent Expenses */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4">Recent Expenses</h3>
                    <ul className="divide-y divide-gray-200">
                        {data.recent_expenses.length > 0 ? (
                            data.recent_expenses.map((expense) => (
                                <li key={expense.id} className="flex justify-between py-3">
                                    <span>{expense.category}</span>
                                    <span className="font-semibold">${expense.amount}</span>
                                    <span className="text-gray-600">{expense.date}</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">No recent expenses.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
