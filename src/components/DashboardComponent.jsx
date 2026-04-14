import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import InvoiceStatusChart from "@/pages/charts/InvoiceStatusChart";
import IncomeExpenseChart from "@/pages/charts/IncomeExpenseChart";

const DashboardContent = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [invoiceData, setInvoiceData] = useState({ paidInvoices: 0, pendingInvoices: 0, overdueInvoices: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) throw new Error("No access token found.");

                const response = await axios.get(import.meta.env.VITE_API_URL + "/api/users/dashboard/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (JSON.stringify(response.data) !== JSON.stringify(dashboardData)) {
                    setDashboardData(response.data);
                }
                console.log(response.data)
            } catch (error) {
                console.error("🚨 Error fetching dashboard data:", error);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        const fetchInvoiceData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) throw new Error("No access token found.");

                const response = await axios.get(import.meta.env.VITE_API_URL + "/api/users/invoice-status-breakdown/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setInvoiceData(response.data);
            } catch (error) {
                console.error("🚨 Error fetching invoice status data:", error);
            }
        };

        fetchDashboardData();
        fetchInvoiceData();
    }, []);

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const {
        total_revenue = 0,
        total_expenses = 0,
        net_profit = 0,
        total_pending = 0,
        expense_distribution = [],
    } = dashboardData || {};

    // 🎨 9 Distinct Colors for Expense Chart
    const chartColors = [
        "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", 
        "#33FFF3", "#FF8C33", "#B8FF33", "#8D33FF"
    ];

    return (
        <div className="flex flex-col items-center w-full max-w-[1600px] min-h-screen p-6">
            <h2 className="text-4xl font-bold mb-8">Admin Dashboard</h2>

            {/* ✅ Financial Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full">
                {[{ title: "Total Revenue", value: total_revenue, color: "text-green-600" },
                  { title: "Total Expenses", value: total_expenses, color: "text-red-600" },
                  { title: "Net Profit", value: net_profit, color: "text-blue-600" },
                  { title: "Pending Invoices", value: total_pending, color: "text-yellow-600" },
                ].map(({ title, value, color }) => (
                    <div key={title} className="bg-white p-8 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
                        <p className={`text-2xl font-bold ${color}`}>{value.toFixed(2)}</p>
                    </div>
                ))}
            </div>

            {/* ✅ Charts Section */}
            <div className="flex flex-col items-center w-full gap-10 mt-10">
                <InvoiceStatusChart
                    paidInvoices={invoiceData.paid_invoices}
                    pendingInvoices={invoiceData.pending_invoices}
                    overdueInvoices={invoiceData.overdue_invoices}
                />
                <IncomeExpenseChart />
            </div>

            {/* ✅ Large Expense Distribution Chart */}
            <div className="w-full max-w-[700px] md:max-w-[900px] lg:max-w-[1100px] mt-12 bg-white p-10 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-6 text-left">Expense Distribution</h3>
                {expense_distribution.length > 0 ? (
                    <div className="flex justify-center">
                        <div className="w-[600px] md:w-[800px] lg:w-[900px]"> {/* ✅ Largest Pie Chart Size */}
                            <Pie
                                data={{
                                    labels: expense_distribution.map(({ category }) => category),
                                    datasets: [
                                        {
                                            data: expense_distribution.map(({ amount }) => amount),
                                            backgroundColor: chartColors.slice(0, expense_distribution.length),
                                            hoverOffset: 10, // ✅ Larger Hover Effect
                                            borderWidth: 2,
                                            borderColor: "#fff",
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: "bottom", // ✅ Move Legend Below for More Space
                                            labels: {
                                                boxWidth: 35,
                                                padding: 20,
                                            },
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: (tooltipItem) => 
                                                    `${tooltipItem.label}: $${tooltipItem.raw.toFixed(2)}`
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No expense data available.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardContent;
