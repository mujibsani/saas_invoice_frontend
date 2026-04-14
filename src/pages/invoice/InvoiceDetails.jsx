import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const InvoiceDetails = () => {
    const { id } = useParams(); // Get invoice ID from URL
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [downloading, setDownloading] = useState(false);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    setError("Unauthorized. Please log in.");
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/invoices/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log(response.data);
                setInvoice(response.data);
            } catch (error) {
                console.error("Error fetching invoice:", error);
                setError("Failed to load invoice details.");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [id]);

    // ✅ Delete Invoice
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this invoice?")) return;

        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/invoices/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Invoice deleted successfully!");
            navigate("/invoices"); // Redirect back to invoice list
        } catch (error) {
            alert("Failed to delete invoice.");
        }
    };

    // ✅ Mark Invoice as Paid
    const handleMarkAsPaid = async () => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/users/invoices/${id}/`,
                { status: "paid" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setInvoice({ ...invoice, status: "paid" });
            alert("Invoice marked as Paid!");
        } catch (error) {
            alert("Failed to update invoice status.");
        }
    };

    // ✅ Download Invoice as PDF
    const handleDownloadPDF = async () => {
        setDownloading(true);
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                throw new Error("User is not authenticated.");
            }
    
            const url = `${import.meta.env.VITE_API_URL}/api/users/invoices/${id}/pdf/`;
    
            console.log(`📢 Fetching PDF from: ${url}`);
    
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: "blob",
                withCredentials: true, // ✅ Ensures authentication works
            });
    
            console.log("✅ Response received:", response);
    
            if (response.status === 200) {
                const blob = new Blob([response.data], { type: "application/pdf" });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.setAttribute("download", `invoice_${id}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                throw new Error("Failed to download PDF.");
            }
        } catch (error) {
            console.error("🚨 Axios Error:", error);
            alert("Failed to download invoice PDF. Check console for details.");
        } finally {
            setDownloading(false);
        }
    };
    

    // ✅ Print Invoice (Opens PDF in New Tab & Auto Prints)
    const handlePrintPDF = async () => {
        setDownloading(true);
        try {
            const token = localStorage.getItem("access_token");
            const url = `${import.meta.env.VITE_API_URL}/api/users/invoices/${id}/pdf/`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: "blob",
            });

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: "application/pdf" });
                const pdfURL = window.URL.createObjectURL(blob);

                // ✅ Open the PDF in a new tab
                const newTab = window.open(pdfURL);
                if (newTab) {
                    setTimeout(() => {
                        newTab.print(); // ✅ Auto-trigger print
                    }, 15000);
                } else {
                    alert("Pop-up blocked! Allow pop-ups for this site.");
                }
            } else {
                throw new Error("Failed to fetch PDF.");
            }
        } catch (error) {
            console.error("Error printing invoice:", error);
            alert("Failed to print invoice.");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) return <p>Loading invoice details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="flex">
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4">Invoice Details</h2>

                <div className="bg-white shadow-md rounded p-6">
                    <p><strong>Invoice #:</strong> {invoice.invoice_number}</p>
                    <p><strong>Client:</strong> {invoice.client_name}</p>
                    <p><strong>Tenant:</strong> {invoice.tenant_name}</p>
                    <p><strong>Due Date:</strong> {invoice.due_date}</p>
                    <p><strong>Total Amount:</strong> ${invoice.total_amount}</p>
                    <p><strong>Status:</strong> 
                        <span className={invoice.status === "paid" ? "text-green-600" : "text-red-600"}>
                            {" "}{invoice.status}
                        </span>
                    </p>

                    {role === "admin" && (
                        <p><strong>Assigned Users:</strong> {invoice.assigned_users.length > 0 ? invoice.assigned_users.join(", ") : "None"}</p>
                    )}

                    {/* ✅ Invoice Items Section */}
                    <h3 className="text-xl font-bold mt-4">Invoice Items</h3>
                    {invoice.items.length > 0 ? (
                        <table className="w-full bg-gray-100 shadow-md rounded mt-4">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-3 text-left">Item Name</th>
                                    <th className="p-3 text-left">Description</th>
                                    <th className="p-3 text-left">Quantity</th>
                                    <th className="p-3 text-left">Unit Price</th>
                                    <th className="p-3 text-left">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3">{item.description}</td>
                                        <td className="p-3">{item.quantity}</td>
                                        <td className="p-3">${item.unit_price}</td>
                                        <td className="p-3 font-bold">${(item.quantity * item.unit_price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500">No items found for this invoice.</p>
                    )}

                    {/* ✅ Buttons */}
                    <div className="flex space-x-4 mt-4">
                        <button
                            onClick={() => navigate(`/edit-invoice/${id}`)}
                            className={`px-4 py-2 rounded ${invoice.status === "paid" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                            disabled={invoice.status === "paid"}  // ✅ Disable button if status is "paid"
                        >
                            Edit
                        </button>
                        <button onClick={handlePrintPDF} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                            Print Invoice
                        </button>
                        <button onClick={handleDownloadPDF} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Download</button>
                        <button onClick={handleMarkAsPaid} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" disabled={invoice.status === "paid"}>Mark as Paid</button>
                        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetails;
