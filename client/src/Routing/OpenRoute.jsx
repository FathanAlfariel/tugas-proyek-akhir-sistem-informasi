import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const OpenRoute = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/getToken")
      .then(({ data }) => {
        setToken(data?.token);

        console.log(data);
      })
      .catch((error) => {
        console.log(error);
        setToken(null);
      });
  }, []);

  if (token === null || token === undefined || token === "") {
    // Allow access to the route if no token is present
    return children;
  } else {
    // Redirect to home if the user already has a token
    return <Navigate to={"/dashboard"} replace={true} />;
  }
};

export default OpenRoute;
