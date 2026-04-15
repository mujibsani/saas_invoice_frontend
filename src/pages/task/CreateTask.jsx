import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL+"/api/users/tasks/";
const USERS_API_URL = import.meta.env.VITE_API_URL+"/api/users/user-list/";
const TENANT_INFO_URL = import.meta.env.VITE_API_URL+"/api/users/tenant-info/";

const CreateTask = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tenantInfo, setTenantInfo] = useState(null);

  const [task, setTask] = useState({
    title: "",
    description: "",
    assigned_to: [],
    priority: "medium",
    status: "todo",
    due_date: "",
    recurring: false,
  });

  // ✅ Fetch Tenant Info FIRST
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("You are not logged in. Redirecting to login page.");
      navigate("/login");
      return;
    }

    axios
      .get(TENANT_INFO_URL, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        console.log("✅ Tenant Info:", res.data);
        setTenantInfo(res.data);

        // ✅ Fetch Users AFTER tenantInfo is set
        axios
          .get(USERS_API_URL, { headers: { Authorization: `Bearer ${token}` } })
          .then((userRes) => {
            console.log("✅ All Users Fetched:", userRes.data);
            const tenantUsers = userRes.data.filter((user) => {
              console.log(`🔍 Checking user: ${user.username}, Tenant ID: ${user.tenant_id}`);
              return user.tenant_id === res.data.id;
            });
            console.log("🔥 Filtered Tenant Users:", tenantUsers);
            setUsers(tenantUsers);
          })
          .catch((err) => console.error("❌ Error fetching users", err));
      })
      .catch((err) => console.error("❌ Error fetching tenant info", err));
  }, [navigate]);

  // ✅ Handle Form Field Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask({
      ...task,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Handle User Selection Changes
  const handleAssignChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => Number(option.value));
    setTask((prevTask) => ({
      ...prevTask,
      assigned_to: selectedOptions,
    }));
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    if (!tenantInfo || users.length === 0) {
      console.warn("⚠️ Tenant Info or Users not loaded yet.");
    } else {
      console.log("🚀 Available Users:", users);
      console.log("🔍 Tenant Info:", tenantInfo);
    }

    try {
      // ✅ Ensure assigned_to contains valid user IDs
      let assignedUsers = task.assigned_to
        .map((id) => Number(id)) // Convert to number
        .filter((id) => {
          const user = users.find((user) => user.id === id);
          console.log(`🔎 Checking assigned user ID: ${id}, Found user:`, user);
          return user && user.tenant_id === tenantInfo.id;
        });

      console.log("🛠 Final Assigned Users Before Submit:", assignedUsers);

      // ✅ If no assigned users, assign the first available tenant admin
      if (assignedUsers.length === 0) {
        const adminUser = users.find((user) => user.role === "admin" && user.tenant_id === tenantInfo?.id);
        if (adminUser) assignedUsers = [adminUser.id];
      }

      const taskData = {
        ...task,
        assigned_to: assignedUsers,
        due_date: task.due_date ? `${task.due_date}T00:00:00Z` : null,
        tenant_id: tenantInfo?.id || null,
        tenant_name: tenantInfo?.name || "Unknown Tenant",
        created_by: tenantInfo?.user?.username || "Unknown User",
      };

      console.log("🚀 Sending Task Data:", JSON.stringify(taskData, null, 2));

      await axios.post(API_URL, taskData, { headers: { Authorization: `Bearer ${token}` } });
      navigate("/tasks");
    } catch (error) {
      console.error("❌ Error creating task", error);
      if (error.response) {
        console.log("⚠️ Backend Response:", error.response.data);
        alert(`Failed to create task: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("Failed to create task. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Task Title"
          className="w-full p-2 border rounded-md"
          required
        />
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Task Description"
          className="w-full p-2 border rounded-md"
        />
        <select
          name="assigned_to"
          multiple
          value={task.assigned_to}
          onChange={handleAssignChange}
          className="w-full p-2 border rounded-md"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        <select name="priority" value={task.priority} onChange={handleChange} className="w-full p-2 border rounded-md">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <input type="date" name="due_date" value={task.due_date} onChange={handleChange} className="w-full p-2 border rounded-md" />
        <button className="w-full p-2 bg-blue-500 text-white rounded-md">Create Task</button>
      </form>
    </div>
  );
};

export default CreateTask;
