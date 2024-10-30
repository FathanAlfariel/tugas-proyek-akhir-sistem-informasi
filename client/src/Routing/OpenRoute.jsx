import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Config/UserConfig";

const OpenRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  if (user) {
    return <Navigate to="/admin" replace={true} />;
  }

  return children;
};

export default OpenRoute;
