import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    const params = new URLSearchParams(location.search);
    const next = params.get("next");

    if (next) {
      return <Navigate to={next} replace />;
    }

    const redirectTo =
      location.state?.from?.pathname ||
      (user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard");

    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicRoute;
