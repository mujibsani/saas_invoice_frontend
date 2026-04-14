import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL +"/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
  
      const data = await response.json();
      localStorage.setItem("token", data.token); // Save token
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };
  const fetchProtectedData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(import.meta.env.VITE_API_URL + "/api/protected-endpoint/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      console.error("Unauthorized");
      return;
    }
  
    const data = await response.json();
    console.log("Protected Data:", data);
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    navigate("/");
  };
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
