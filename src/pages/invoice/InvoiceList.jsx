import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    const [clientName, setClientName] = useState("");
    const [userName, setUserName] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState(new Date().getFullYear());
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    useEffect(() => {
        fetchInvoices();
        fetchClients();
        fetchUsers();
    }, []);

    useEffect(() => {
        fetchInvoices(); // Refetch when filters change
    }, [clientName, userName, month, year, status]);

    const fetchInvoices = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                setError("Unauthorized. Please log in.");
                setLoading(false);
                return;
            }

            let url = import.meta.env.VITE_API_URL +"/api/users/invoices/";
            const params = new URLSearchParams();
            if (clientName) params.append("client_name", clientName);
            if (userName) params.append("user_name", userName);
            if (month) params.append("month", month);
            if (year) params.append("year", year);
            if (status) params.append("status", status);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setInvoices(response.data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            if (error.response) {
                setError(
                    `Failed to load invoices: ${error.response.statusText} (${error.response.status})`
                );
            } else {
                setError("Failed to load invoices.");
            }
        }

        setLoading(false);
    };

    const fetchClients = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get(import.meta.env.VITE_API_URL +"/api/users/clients/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClients(response.data);
        } catch (error) {
            console.error("Error fetching clients:", error);
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
            console.error("Error fetching users:", error);
        }
    };

    const getAssignedUsernames = (assignedUserIds) => {
        return assignedUserIds
            .map((userId) => {
                const user = users.find((user) => user.id === userId);
                return user ? user.username : null;
            })
            .filter((username) => username)
            .join(", ");
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Invoice List</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="flex flex-wrap gap-4 mb-6">
                <select value={clientName} onChange={(e) => setClientName(e.target.value)} className="p-2 border rounded w-1/4">
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.name}>
                            {client.name}
                        </option>
                    ))}
                </select>

                <select value={userName} onChange={(e) => setUserName(e.target.value)} className="p-2 border rounded w-1/4">
                    <option value="">Select User</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.username}>
                            {user.username}
                        </option>
                    ))}
                </select>

                <select value={month} onChange={(e) => setMonth(e.target.value)} className="p-2 border rounded w-1/6">
                    <option value="">Select Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString("default", { month: "long" })}
                        </option>
                    ))}
                </select>

                <select value={year} onChange={(e) => setYear(e.target.value)} className="p-2 border rounded w-1/6">
                    <option value="">Select Year</option>
                    {Array.from({ length: 10 }, (_, i) => {
                        const y = new Date().getFullYear() - i;
                        return (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        );
                    })}
                </select>

                <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 border rounded w-1/6">
                    <option value="">Filter by Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                </select>
            </div>

            {role === "admin" && (
                <button
                    onClick={() => navigate("/create-invoice")}
                    className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                >
                    Create Invoice
                </button>
            )}

            {loading ? (
                <p>Loading invoices...</p>
            ) : invoices.length === 0 ? (
                <p>No invoices found.</p>
            ) : (
                <table className="w-full bg-white shadow-md rounded">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left">Invoice #</th>
                            <th className="p-3 text-left">Client</th>
                            <th className="p-3 text-left">Amount</th>
                            <th className="p-3 text-left">Due Date</th>
                            {role === "admin" && <th className="p-3 text-left">Assigned Users</th>}
                            <th className="p-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr
                                key={invoice.id}
                                className="border-b cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => navigate(`/invoice/${invoice.id}`)}
                            >
                                <td className="p-3">{invoice.invoice_number}</td>
                                <td className="p-3">{invoice.client_name}</td>
                                <td className="p-3">${invoice.total_amount?.toFixed(2)}</td>
                                <td className="p-3">{invoice.due_date}</td>
                                {role === "admin" && (
                                    <td className="p-3">{getAssignedUsernames(invoice.assigned_users)}</td>
                                )}
                                <td
                                    className={`p-3 ${
                                        invoice.status === "paid"
                                            ? "text-green-600"
                                            : invoice.status === "overdue"
                                            ? "text-red-600"
                                            : "text-yellow-600"
                                    }`}
                                >
                                    {invoice.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default InvoiceList;
