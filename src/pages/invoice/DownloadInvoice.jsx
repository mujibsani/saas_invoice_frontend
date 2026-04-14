import { useState } from "react";
import axios from "axios";

const DownloadInvoice = ({ invoiceId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDownload = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("access_token");
            const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/pdf" };

            // ✅ Make API request to download the PDF
            const response = await axios.get(
                `http://127.0.0.1:8000/api/users/invoices/${invoiceId}/pdf/`,
                { headers, responseType: "blob" } // ✅ Ensure binary response
            );

            // ✅ Create a Blob (binary large object) URL for the response data
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice_${invoiceId}.pdf`);
            document.body.appendChild(link);
            link.click();

            // ✅ Cleanup the temporary URL
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error downloading invoice:", err);
            setError("Failed to download invoice.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleDownload}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                {loading ? "Downloading..." : "Download Invoice PDF"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default DownloadInvoice;
