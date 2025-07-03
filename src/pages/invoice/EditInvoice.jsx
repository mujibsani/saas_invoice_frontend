import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditInvoice = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    const [tenantId, setTenantId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        client: "",
        assigned_users: [],
        invoice_number: "",
        due_date: "",
        status: "pending",
        tenant: "",
        items: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const headers = { Authorization: `Bearer ${token}` };

                // ✅ Fetch Invoice Details
                const invoiceRes = await axios.get(`http://127.0.0.1:8000/api/users/invoices/${id}/`, { headers });
                const invoice = invoiceRes.data;
                setFormData({
                    client: invoice.client,
                    assigned_users: invoice.assigned_users.map(user => user.id),
                    invoice_number: invoice.invoice_number,
                    due_date: invoice.due_date,
                    status: invoice.status,
                    tenant: invoice.tenant,
                    items: invoice.items.map(item => ({
                        id: item.id,
                        name: item.name,
                        description: item.description || "",
                        quantity: item.quantity,
                        unit_price: item.unit_price
                    }))
                });

                // ✅ Fetch Clients
                const clientsRes = await axios.get("http://127.0.0.1:8000/api/users/clients/", { headers });
                setClients(clientsRes.data);

                // ✅ Fetch Users
                const usersRes = await axios.get("http://127.0.0.1:8000/api/users/user-list/", { headers });
                setUsers(usersRes.data);

                // ✅ Fetch Tenant Info
                const tenantRes = await axios.get("http://127.0.0.1:8000/api/users/tenant-info/", { headers });
                setTenantId(tenantRes.data.id);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching invoice:", err);
                setError("Failed to load invoice details.");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMultiSelect = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value) || null);
        setFormData({ ...formData, assigned_users: selectedOptions.filter(id => id !== null) }); // ✅ Remove invalid/null values
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = value;
        setFormData({ ...formData, items: updatedItems });
    };

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { id: null, name: "", description: "", quantity: 1, unit_price: 0 }]
        });
    };

    const handleRemoveItem = (index) => {
        if (formData.items.length === 1) return;
        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: updatedItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access_token");
            const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    
            // ✅ Ensure assigned_users is an array of valid user IDs (no null)
            const validAssignedUsers = formData.assigned_users.filter(userId => userId !== null && !isNaN(userId));
    
            const invoiceData = {
                ...formData,
                tenant: tenantId,
                assigned_users: validAssignedUsers,  // ✅ Ensure no `None`
                items: formData.items.map(item => ({
                    id: item.id || null,
                    name: item.name,
                    description: item.description || "",
                    quantity: item.quantity,
                    unit_price: item.unit_price
                }))
            };
    
            console.log("Sending Data:", JSON.stringify(invoiceData, null, 2));  // ✅ Log data before sending
    
            await axios.put(`http://127.0.0.1:8000/api/users/invoices/${id}/`, invoiceData, { headers });
    
            alert("Invoice updated successfully!");
            navigate("/invoices");
    
        } catch (error) {
            console.error("Error updating invoice:", error.response ? error.response.data : error.message);
            alert(`Failed to update invoice: ${JSON.stringify(error.response?.data) || "Unknown error"}`);
        }
    };
    
    

    if (loading) return <p>Loading invoice details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="flex">
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4">Edit Invoice</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Client Selection */}
                    <label>Client</label>
                    <select name="client" value={formData.client} onChange={handleChange} required className="p-2 border rounded w-full">
                        <option value="">Select Client</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>

                    {/* Assign Users */}
                    <label>Assign To Users</label>
                    <select name="assigned_users" multiple value={formData.assigned_users} onChange={handleMultiSelect} className="p-2 border rounded w-full">
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>

                    {/* Invoice Items */}
                    <label>Invoice Items</label>
                    {formData.items.map((item, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                            <input type="text" placeholder="Item Name" value={item.name} onChange={(e) => handleItemChange(index, "name", e.target.value)} className="p-2 border rounded w-1/5" required/>
                            <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} className="p-2 border rounded w-1/5" required/>
                            <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} className="p-2 border rounded w-1/5" required/>
                            <input type="number" placeholder="Unit Price" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value))} className="p-2 border rounded w-1/5" required/>
                            <button type="button" onClick={() => handleRemoveItem(index)} className="bg-red-500 text-white px-2 rounded">X</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddItem} className="bg-green-500 text-white px-4 py-2 rounded">+ Add Item</button>

                    {/* Submit Button */}
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update Invoice</button>
                </form>
            </div>
        </div>
    );
};

export default EditInvoice;
