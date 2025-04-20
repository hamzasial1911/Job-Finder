import React from "react";
import { Navigate } from "react-router-dom";
import useUser from "../Components/hooks/useUser";

const ProtectedRoute = ({ children, allowedRoles }) => {
 

  // Check for user authentication and role
  const user = JSON.parse(localStorage.getItem("user"));
  const Authanticated = user?.state?.isAuthanticated
  console.log (Authanticated)


  if (!Authanticated) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.state?.user?.role)) {
    // Redirect to homepage if the user doesn't have access to the role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
