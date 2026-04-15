import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL+"/api/users/tasks/";
const USERS_API_URL = import.meta.env.VITE_API_URL+"/api/users/user-list/";

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    username: "",
    priority: "",
    status: "",
    date: "",
    due_date: "",
  });
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("You are not logged in. Redirecting to login page.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      }
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.get(USERS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Task List</h1>
        <Link to="/tasks/create" className="px-4 py-2 bg-blue-500 text-white rounded-md">
          + Create Task
        </Link>
      </div>
      {/* Task List */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <p className="text-sm font-bold text-blue-600">Priority: {task.priority}</p>
            <p className="text-sm font-bold text-red-600">Status: {task.status}</p>
            <p className="text-sm text-gray-500">Created By: {task.created_by}</p>
            <p className="text-sm text-gray-500">Due Date: {task.due_date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
