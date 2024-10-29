import axios from "axios";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { data } = axios.get("http://localhost:5000/api/auth/getToken");

  console.log(data);

  return data?.token !== null || data?.token !== undefined ? (
    children
  ) : (
    <Navigate to={"/login"} replace={true} />
  );
};

export default PrivateRoute;
