import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL+"/api/users/tasks/";
const USERS_API_URL = import.meta.env.VITE_API_URL+"/api/users/user-list/";
const TENANT_INFO_URL = import.meta.env.VITE_API_URL+"/api/users/tenant-info/";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tenantInfo, setTenantInfo] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem("role")); // Get user role
  const [task, setTask] = useState(null); // ✅ Fix: Start with null to prevent empty load

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("You are not logged in. Redirecting to login page.");
      navigate("/login");
      return;
    }

    const fetchTask = async () => {
      try {
        const res = await axios.get(`${API_URL}${id}/`, { headers: { Authorization: `Bearer ${token}` } });
        setTask(res.data);
      } catch (err) {
        console.error("Error fetching task details", err);
        alert("Error fetching task details. Try again.");
        navigate("/tasks");
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get(USERS_API_URL, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };

    const fetchTenantInfo = async () => {
      try {
        const res = await axios.get(TENANT_INFO_URL, { headers: { Authorization: `Bearer ${token}` } });
        setTenantInfo(res.data);
      } catch (err) {
        console.error("Error fetching tenant info", err);
      }
    };

    fetchTask();
    fetchUsers();
    fetchTenantInfo();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAssignChange = (e) => {
    if (userRole !== "admin") return; // Prevent users from modifying assigned_to
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => Number(option.value));
    setTask((prev) => ({
      ...prev,
      assigned_to: selectedOptions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      let taskData;
      if (userRole === "admin") {
        taskData = { ...task, due_date: task.due_date ? `${task.due_date}T00:00:00Z` : null };
      } else {
        taskData = { status: task.status, status_note: task.status_note }; // ✅ Only send status & note for users
      }

      await axios.patch(`${API_URL}${id}/`, taskData, { headers: { Authorization: `Bearer ${token}` } });
      navigate("/tasks");
    } catch (error) {
      console.error("Error updating task", error);
      alert("Failed to update task. Please try again.");
    }
  };

  if (!task) {
    return <p className="text-center text-gray-500">Loading task details...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={task.title}
          disabled={userRole !== "admin"}
          onChange={handleChange}
          placeholder="Task Title"
          className="w-full p-2 border rounded-md"
        />
        <textarea
          name="description"
          value={task.description}
          disabled={userRole !== "admin"}
          onChange={handleChange}
          placeholder="Task Description"
          className="w-full p-2 border rounded-md"
        />
        <select
          name="assigned_to"
          multiple
          value={task.assigned_to}
          disabled={userRole !== "admin"}
          onChange={handleAssignChange}
          className="w-full p-2 border rounded-md"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
        <select
          name="priority"
          value={task.priority}
          disabled={userRole !== "admin"}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <select
          name="status"
          value={task.status}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="todo">To-do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <textarea
          name="status_note"
          value={task.status_note}
          onChange={handleChange}
          placeholder="Optional status update note..."
          className="w-full p-2 border rounded-md"
        />
        <input
          type="date"
          name="due_date"
          value={task.due_date}
          disabled={userRole !== "admin"}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="recurring"
            checked={task.recurring}
            disabled={userRole !== "admin"}
            onChange={handleChange}
          />
          <span>Recurring Task</span>
        </label>
        <button className="w-full p-2 bg-blue-500 text-white rounded-md">
          {userRole === "admin" ? "Update Task" : "Request Status Change"}
        </button>
      </form>
    </div>
  );
};

export default EditTask;
