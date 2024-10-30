import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Config/UserConfig";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
};

export default PrivateRoute;
