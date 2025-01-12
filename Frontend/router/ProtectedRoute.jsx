import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("role"); // Assumes role is stored in localStorage

  if (!authToken || userRole !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
