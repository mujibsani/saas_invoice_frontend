import axios from "axios";

// Base URL for the Django backend
const API_BASE_URL = "http://127.0.0.1:8000/api/users/";

// Create an Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

// Add JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ==========================
// Authentication APIs
// ==========================

export const loginUser = async (credentials) => {
    const response = await api.post("login/", credentials);
    if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("role", response.data.role);
    }
    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
};

// ==========================
// User Management APIs
// ==========================

export const registerAdmin = async (userData) => {
    return await api.post("register/", userData);
};

export const addUser = async (userData) => {
    return await api.post("add-user/", userData);
};

export const getCurrentUserRole = () => {
    return localStorage.getItem("role");
};

// ==========================
// Client Management APIs
// ==========================

export const getClients = async () => {
    return await api.get("clients/");
};

export const addClient = async (clientData) => {
    return await api.post("clients/", clientData);
};

// ==========================
// Invoice Management APIs
// ==========================

export const getInvoices = async () => {
    return await api.get("invoices/");
};

export const createInvoice = async (invoiceData) => {
    return await api.post("invoices/", invoiceData);
};

export const getInvoiceDetails = async (id) => {
    return await api.get(`invoices/${id}/`);
};

// ==========================
// Expense Management APIs
// ==========================

export const getExpenses = async () => {
    return await api.get("expenses/");
};

export const createExpense = async (expenseData) => {
    return await api.post("expenses/", expenseData);
};

// ==========================
// Dashboard APIs
// ==========================

export const getDashboardData = async () => {
    return await api.get("dashboard/");
};

export default api;
