import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import { getMe } from "../services/auth.api";

export default function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null);
  const token = getToken();

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    // Verify token is valid
    getMe()
      .then(() => setIsValid(true))
      .catch(() => setIsValid(false));
  }, [token]);

  if (isValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
