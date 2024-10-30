import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const OpenRoute = ({ children }) => {
  const { data } = axios.get("http://localhost:5000/api/auth/getToken");

  return data?.token === null ||
    data?.token === undefined ||
    data?.token === "" ? (
    // Allow access to the route if no token is present
    children
  ) : (
    // Redirect to home if the user already has a token
    <Navigate to={"/admin"} replace={true} />
  );
};

export default OpenRoute;
