import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Get user data
  useEffect(() => {
    if (!user) {
      axios
        .get("http://localhost:5000/api/auth/getUser")
        .then(({ data }) => {
          setUser(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user]);

  const contextValue = {
    user,
    setUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
