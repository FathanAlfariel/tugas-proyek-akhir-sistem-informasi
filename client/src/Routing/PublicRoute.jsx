import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/auth/getToken"
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
    return <div>Loading...</div>; // Or your loading component
  }

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default PublicRoute;
