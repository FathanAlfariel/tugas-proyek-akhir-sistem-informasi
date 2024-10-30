import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Config/UserConfig";

const OpenRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  if (user) {
    <Navigate to="/admin" replace={true} />;
    return;
  }

  return children;
};

export default OpenRoute;
