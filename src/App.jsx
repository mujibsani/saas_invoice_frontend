import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// Import components and pages
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/users/UserDashboard";
import Login from "./pages/auths/Login";
import Register from "./pages/auths/Register";
import ForgotPassword from "./pages/auths/ForgotPassword";
import ClientList from "./pages/clients/ClientList";
import AddUserForm from "./pages/users/AddUser";
import CreateInvoice from "./pages/invoice/CreateInvoice";
import InvoiceList from "./pages/invoice/InvoiceList";
import InvoiceDetails from "./pages/invoice/InvoiceDetails";
import EditInvoice from "./pages/invoice/EditInvoice";
import AddExpense from "./pages/expense/AddExpense";
import ExpenseList from "./pages/expense/ExpenseList";
import ExpenseDetails from "./pages/expense/ExpenseDetails";
import EditExpense from "./pages/expense/EditExpense";
import Settings from "./pages/Settings";
import Sidebar from "./components/SideBarComponent"
import UserList from "./pages/users/UserList";
import AddClient from "./pages/clients/AddClient";
import Unauthorized from "./pages/auths/Unauthorized";
import ApproveExpenses from "./pages/expense/ApproveExpenses";
import Notifications from "./pages/notifications/Notifications";
import TaskList from "./pages/task/TaskList";
import CreateTask from "./pages/task/CreateTask";
import EditTask from "./pages/task/EditTask";
// import TaskDetails from "./pages/task/TaskDetails";
// Landing Pages
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";
import FeaturesPage from "./pages/FeaturesPage";



// Private Route Component
const PrivateRoute = ({ element, requiredRoles }) => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token) return <Navigate to="/login" replace />;
    if (!requiredRoles.includes(role)) return <Navigate to="/unauthorized" replace />;

    return element;
};

// Layout Component
const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthenticated = !!localStorage.getItem("access_token");

    // Define routes where Sidebar should NOT be displayed
    const hideSidebarRoutes = ["/", "/features", "/pricing"];

    return (
        <div className="flex">
            {!hideSidebarRoutes.includes(location.pathname) && isAuthenticated && <Sidebar />}
            <div className="flex-1 p-4">{children}</div>
        </div>
    );
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access_token"));
    const [userRole, setUserRole] = useState(localStorage.getItem("role") || null);

    const updateAuthState = () => {
        setIsAuthenticated(!!localStorage.getItem("access_token"));
        setUserRole(localStorage.getItem("role"));
    };

    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(!!localStorage.getItem("access_token"));
            setUserRole(localStorage.getItem("role"));
        };

        checkAuth();
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    return (
        <Router>
            <Layout>
                <Routes>
                    {/* Landing Pages */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/pricing" element={<PricingPage />} />

                    {/* Authentication Routes */}
                    <Route path="/login" element={<Login onLogin={updateAuthState} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Admin Routes */}
                    <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} requiredRoles={["admin"]} />} />
                    <Route path="/users" element={<PrivateRoute element={<UserList />} requiredRoles={["admin"]} />} />
                    <Route path="/add-user" element={<PrivateRoute element={<AddUserForm />} requiredRoles={["admin"]} />} />
                    <Route path="/add-client" element={<PrivateRoute element={<AddClient />} requiredRoles={["admin"]} />} />
                    <Route path="/edit-invoice/:id" element={<PrivateRoute element={<EditInvoice />} requiredRoles={["admin"]} />} />
                    <Route path="/edit-expense/:id" element={<PrivateRoute element={<EditExpense />} requiredRoles={["admin"]} />} />

                    {/* Admin & User Routes */}
                    <Route path="/create-invoice" element={<PrivateRoute element={<CreateInvoice />} requiredRoles={["admin", "user"]} />} />
                    <Route path="/user-dashboard" element={<PrivateRoute element={<UserDashboard />} requiredRoles={["user"]} />} />
                    <Route path="/clients" element={<PrivateRoute element={<ClientList />} requiredRoles={["admin", "user"]} />} />
                    <Route path="/invoices" element={<PrivateRoute element={<InvoiceList />} requiredRoles={["admin", "user"]} />} />
                    <Route path="/invoice/:id" element={<PrivateRoute element={<InvoiceDetails />} requiredRoles={["admin", "user"]} />} />
                    <Route path="/expenses" element={<PrivateRoute element={<ExpenseList />} requiredRoles={["admin", "user"]} />} />
                    <Route path="/expense/:id" element={<PrivateRoute element={<ExpenseDetails />} requiredRoles={["admin", "user"]} />} />
                    <Route path="/settings" element={<PrivateRoute element={<Settings />} requiredRoles={["admin", "user"]} />} />

                    {/* Add Expense Route for Users & Admins */}
                    <Route path="/add-expense" element={<PrivateRoute element={<AddExpense />} requiredRoles={["admin", "user"]} />} />

                    {/* Add Task Route for Users & Admins */}
                    <Route path="/tasks" element={<PrivateRoute element={<TaskList />} requiredRoles={["admin", "user"]} />} />
                    <Route path="/tasks/create" element={<PrivateRoute element={<CreateTask />} requiredRoles={["admin"]} />} />
                    <Route path="/tasks/edit/:id" element={<PrivateRoute element={<EditTask />} requiredRoles={["admin", "user"]} />} />
                    
                    {/* Admin-Only Route for Approving Expenses */}
                    <Route path="/approve-expenses" element={<PrivateRoute element={<ApproveExpenses />} requiredRoles={["admin"]} />} />
                    {/* <Route path="/notifications" element={<PrivateRoute element={<Notifications />} requiredRoles={["admin", "user"]} />} /> */}

                    {/* Unauthorized Route */}
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Default Redirect */}
                    <Route path="*" element={<Navigate to={userRole === "admin" ? "/dashboard" : "/user-dashboard"} />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
