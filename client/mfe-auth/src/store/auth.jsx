import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
       return window.localStorage.getItem("token") || "";
    })

    const storeTokenInLS = (token) => {
        setToken(token);
    }

    useEffect(() => {
        if(token){
            
            window.localStorage.setItem("token", token);
        }else{
            window.localStorage.removeItem("token");
        }
    },[token, setToken])

    return (
        <AuthContext.Provider value={{storeTokenInLS, token, setToken}}>{children}</AuthContext.Provider>
    )
};

export const AuthConsumer = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};