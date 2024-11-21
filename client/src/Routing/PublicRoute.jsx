import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../Components/Loader";

const PublicRoute = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const fetchToken = async () => {
      await axios
        .get("http://localhost:5000/api/auth/getToken")
        .then(({ data }) => {
          setToken(data.token);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchToken();
  }, []);

  if (loading) {
    return <Loader />; // Or your loading component
  }

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default PublicRoute;
