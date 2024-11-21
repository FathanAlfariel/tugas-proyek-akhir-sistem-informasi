import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Components/Loader";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get user data
  useEffect(() => {
    setIsLoading(true);

    if (!user) {
      axios
        .get("http://localhost:5000/api/auth/getUser")
        .then(({ data }) => {
          setUser(data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    setIsLoading(false);
  }, [user]);

  const contextValue = {
    user,
    setUser,
  };

  return (
    <>
      {isLoading && <Loader />}

      <UserContext.Provider value={contextValue}>
        {children}
      </UserContext.Provider>
    </>
  );
};
