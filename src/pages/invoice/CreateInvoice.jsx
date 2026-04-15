import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateInvoice = () => {
    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    const [tenantId, setTenantId] = useState("");
    const [userId, setUserId] = useState(""); // Store logged-in user ID
    const [role, setRole] = useState(""); // Store user role

    const [formData, setFormData] = useState({
        client: "",
        assigned_users: [],
        invoice_number: "",
        due_date: "",
        status: "pending",
        tenant: "",
        items: [{ name: "", description: "", quantity: 1, unit_price: 0 }],
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const userRole = localStorage.getItem("role");
                const userId = localStorage.getItem("user_id"); // Assuming user ID is stored
                setRole(userRole);
                setUserId(userId);

                const headers = { Authorization: `Bearer ${token}` };

                // Fetch Clients
                const clientsRes = await axios.get(import.meta.env.VITE_API_URL +"/api/users/clients/", { headers });
                setClients(clientsRes.data);

                // Fetch Users (Admins can see all, users don't need this)
                if (userRole === "admin") {
                    const usersRes = await axios.get(import.meta.env.VITE_API_URL +"/api/users/user-list/", { headers });
                    setUsers(usersRes.data);
                }

                // Fetch Tenant Info
                const tenantRes = await axios.get(import.meta.env.VITE_API_URL +"/api/users/tenant-info/", { headers });
                // Fetch Last Invoice Number
                const lastInvoiceRes = await axios.get(import.meta.env.VITE_API_URL +"/api/users/invoices/last/", { headers });

                let lastInvoiceNumber = lastInvoiceRes.data.invoice_number || "INV-1000";
                // console.log("last:", lastInvoiceNumber);
                console.log(lastInvoiceRes.data, lastInvoiceNumber.substring(lastInvoiceNumber.length-4));
                
                if(lastInvoiceNumber.substring(lastInvoiceNumber.length-4) == "1001"){
                    const temp_number = lastInvoiceNumber.substring(lastInvoiceNumber.length-4);
                    lastInvoiceNumber = tenantRes.data.name+"-"+temp_number;
                    console.log("condition: ",lastInvoiceNumber);
                }
                
                const newInvoiceNumber = `${tenantRes.data.name}-${parseInt(lastInvoiceNumber.replace(tenantRes.data.name+"-", ""), 10) + 1}`;
                
                setTenantId(tenantRes.data.id);
                
                setFormData((prev) => ({
                    ...prev,
                    tenant: tenantRes.data.id,
                    assigned_users: userRole !== "admin" ? [userId] : [], // Auto-assign non-admin users
                    invoice_number: newInvoiceNumber,
                }));
            } catch (error) {
                console.error("Error fetching data:", error.response ? error.response.data : error.message);
            }
        };

        fetchData();
    }, []);
    console.log("tenant id: ", tenantId);
    // ✅ Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle Multi-Select Change for Assigned Users (Admin Only)
    const handleMultiSelect = (e) => {
        if (role !== "admin") return; // Prevent users from manually assigning others
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData({ ...formData, assigned_users: selectedOptions });
    };

    // ✅ Handle Item Input Change
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = field === "quantity" || field === "unit_price" ? parseFloat(value) || 0 : value;
        setFormData({ ...formData, items: updatedItems });
    };

    // ✅ Add New Item Row
    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { name: "", description: "", quantity: 1, unit_price: 0 }],
        });
    };

    // ✅ Remove Item Row
    const removeItem = (index) => {
        if (formData.items.length === 1) return;
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index),
        });
    };

    // ✅ Calculate Total Amount
    const totalAmount = formData.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price, 
        0
    );

    // ✅ Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access_token");
            const headers = { Authorization: `Bearer ${token}` };

            if (!tenantId) {
                alert("Tenant ID is missing. Please refresh the page and try again.");
                return;
            }

            const invoiceData = {
                ...formData,
                tenant: tenantId,
                assigned_users: role !== "admin" ? [userId] : formData.assigned_users, // Ensure auto-assignment
            };

            console.log("Submitting Invoice:", invoiceData);
            await axios.post(import.meta.env.VITE_API_URL+"/api/users/invoices/manage/", invoiceData, { headers });

            alert("Invoice created successfully!");
            navigate("/invoices");

        } catch (error) {
            console.error("Error creating invoice:", error.response ? error.response.data : error.message);
            alert(`Failed to create invoice: ${error.response?.data?.error || "Unknown error"}`);
        }
    };

    return (
        <div className="flex">
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4">Create Invoice</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="hidden" name="tenant" value={tenantId} />

                    {/* Client Selection */}
                    <label>Client</label>
                    <select name="client" value={formData.client} onChange={handleChange} required className="p-2 border rounded w-full">
                        <option value="">Select Client</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>

                    {/* Assign Users (Only Visible for Admins) */}
                    {role === "admin" && (
                        <>
                            <label>Assign To Users</label>
                            <select name="assigned_users" multiple value={formData.assigned_users} onChange={handleMultiSelect} className="p-2 border rounded w-full">
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>{user.username}</option>
                                ))}
                            </select>
                        </>
                    )}

                    {/* Invoice Number */}
                    <label>Invoice Number</label>
                    <input 
                        type="text" 
                        name="invoice_number" 
                        value={formData.invoice_number} 
                        onChange={handleChange} 
                        required className="p-2 border rounded w-full"
                        readOnly 
                        style={{ userSelect: "none", cursor: "not-allowed" }} 
                        />

                    {/* Due Date */}
                    <label>Due Date</label>
                    <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} required className="p-2 border rounded w-full"/>

                    {/* Status Selection */}
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="p-2 border rounded w-full">
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                    </select>

                    {/* Invoice Items */}
                    <h3 className="text-xl font-bold mt-4">Invoice Items</h3>
                    {formData.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-5 gap-4 items-center border p-2 rounded">
                            <input type="text" placeholder="Item Name" value={item.name} onChange={(e) => handleItemChange(index, "name", e.target.value)} className="p-2 border rounded" required />
                            <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} className="p-2 border rounded" />
                            <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} className="p-2 border rounded" required />
                            <input type="number" placeholder="Unit Price" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", e.target.value)} className="p-2 border rounded" required />
                            <button type="button" onClick={() => removeItem(index)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Remove</button>
                        </div>
                    ))}
                    <button 
                        type="button" 
                        onClick={addItem} 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-4">
                            
                        + Add Item
                    </button>

                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4">

                        Create Invoice
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateInvoice;
