// Frontend\src\context\AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user data from localStorage on initialization
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("role");
        const name = localStorage.getItem("name");

        if (token && role) {
            setUser({ token, role, name });
        }
        setLoading(false);
    }, []);

    // Save user data to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("authToken", user.token);
            localStorage.setItem("role", user.role);
            localStorage.setItem("name", user.name);
        } else {
            localStorage.removeItem("authToken");
            localStorage.removeItem("role");
            localStorage.removeItem("name");
        }
    }, [user]);

    const login = (userData) => {
        setUser(userData); // Set user data and save it to localStorage via the effect
    };

    const logout = () => {
        setUser(null); // Clear user data from context
        localStorage.removeItem("authToken"); // Remove the token
        localStorage.removeItem("role"); // Remove the role
        localStorage.removeItem("name"); // Remove the role
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
