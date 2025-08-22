import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 
  const [auth, setAuth] = useState(() => {
    const token = window.localStorage.getItem("token") || "";
    const role = window.localStorage.getItem("role") || "";
    return { token, role };
  });
  const [loading, setLoading] = useState(true);
  console.log("auth", auth);

  const storeAuthInLS = (token, role) => {
    setAuth({ token, role });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/verify", {
          method: "GET",
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        console.log("response in  validateToken", response);
        const result = await response.json();
        console.log("result in  validateToken", result);
        console.log("loading", loading);
        

        if(!response.ok && result.error){
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setAuth({ token: null, role: null});
        }else{
          setAuth({token: storedToken, role: result.user.role});
          setLoading(false);
        }

      } catch (error) {
        console.error("Auth validation failed:", error);
        localStorage.removeItem("token");
        setAuth({ token: null, role: null });
      }
    };
    validateToken();
  }, []);

  useEffect(() => {
    if (auth.token) {
      console.log("11111111111111", auth.token);

      window.localStorage.setItem("token", auth.token);
      window.localStorage.setItem("role", auth.role);
    } else {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("role");
    }
  }, [auth]);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const role = window.localStorage.getItem("role");
    if (token && role) {
      setAuth({ token, role });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, storeAuthInLS, setAuth, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
