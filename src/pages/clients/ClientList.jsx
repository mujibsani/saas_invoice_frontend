import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [editingClient, setEditingClient] = useState(null);
    const navigate = useNavigate();

    // ✅ Fetch Clients
    const fetchClients = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");
            const response = await axios.get(import.meta.env.VITE_API_URL +"/api/users/clients/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            setClients(response.data);
        } catch (error) {
            setError("Failed to fetch clients.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch Clients on Page Load
    useEffect(() => {
        fetchClients();
    }, []);

    // ✅ Delete Client
    const handleDelete = async (clientId) => {
        if (!window.confirm("Are you sure you want to delete this client?")) return;

        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/clients/${clientId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setClients(clients.filter((client) => client.id !== clientId)); // ✅ Remove from UI instantly
        } catch (error) {
            alert("Failed to delete client.");
        }
    };

    // ✅ Handle Edit Client
    const handleEdit = (client) => {
        setEditingClient(client);
    };

    // ✅ Handle Save Client Changes
    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.put(`${import.meta.env.VITE_API_URL}/api/users/clients/${editingClient.id}/`, editingClient, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setClients(clients.map((c) => (c.id === editingClient.id ? editingClient : c)));
            setEditingClient(null);
        } catch (error) {
            alert("Failed to update client.");
        }
    };

    // ✅ Handle Reset Password
    const handleResetPassword = async (clientId, clientName) => {
        const newPassword = prompt(`Enter a new password for ${clientName}:`);
        if (!newPassword) return;

        try {
            const token = localStorage.getItem("access_token");
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/users/reset-password/${clientId}/`,
                { new_password: newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Password reset successfully!");
        } catch (error) {
            alert("Failed to reset password.");
        }
    };

    return (
        <div className="flex">
            <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Client List</h2>
                    <button
                        onClick={() => navigate("/add-client")}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        + Add Client
                    </button>
                </div>

                {error && <p className="text-red-500">{error}</p>}
                {loading ? (
                    <p>Loading clients...</p>
                ) : clients.length === 0 ? (
                    <p>No clients found.</p>
                ) : (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Phone</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr
                                    key={client.id}
                                    className="text-center border-t cursor-pointer hover:bg-gray-100"
                                    onClick={() => setSelectedClient(client)}
                                >
                                    <td className="border p-2">{client.name}</td>
                                    <td className="border p-2">{client.email}</td>
                                    <td className="border p-2">{client.phone}</td>
                                    <td className="border p-2 space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(client);
                                            }}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(client.id);
                                            }}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleResetPassword(client.id, client.name);
                                            }}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Reset Password
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ✅ View Client Details Modal */}
            {selectedClient && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Client Details</h3>
                        <p><strong>Name:</strong> {selectedClient.name}</p>
                        <p><strong>Email:</strong> {selectedClient.email}</p>
                        <p><strong>Phone:</strong> {selectedClient.phone}</p>
                        <p><strong>Address:</strong> {selectedClient.address || "N/A"}</p>
                        <p><strong>Details:</strong> {selectedClient.details || "N/A"}</p>

                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => {
                                    setEditingClient(selectedClient);
                                    setSelectedClient(null); // Close details modal
                                }}
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(selectedClient.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>

                            <button
                                onClick={() => setSelectedClient(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Edit Client Modal */}
            {editingClient && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h3 className="text-xl font-semibold mb-4">Edit Client</h3>

                    <input
                        type="text"
                        placeholder="Name"
                        value={editingClient.name}
                        onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                        className="w-full p-2 border rounded mb-3"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={editingClient.email}
                        onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                        className="w-full p-2 border rounded mb-3"
                    />

                    <input
                        type="text"
                        placeholder="Phone"
                        value={editingClient.phone}
                        onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                        className="w-full p-2 border rounded mb-3"
                    />

                    <input
                        type="text"
                        placeholder="Address"
                        value={editingClient.address || ""}
                        onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                        className="w-full p-2 border rounded mb-3"
                    />

                    <textarea
                        placeholder="Details"
                        value={editingClient.details || ""}
                        onChange={(e) => setEditingClient({ ...editingClient, details: e.target.value })}
                        className="w-full p-2 border rounded mb-3"
                        rows="3"
                    />

                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setEditingClient(null)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveChanges}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
};

export default ClientList;
