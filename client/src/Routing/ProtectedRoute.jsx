import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../Components/Loader";

const ProtectedRoute = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/getToken`
        );
        setToken(data.token);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  if (loading) {
    return <Loader />; // Or your loading component
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
