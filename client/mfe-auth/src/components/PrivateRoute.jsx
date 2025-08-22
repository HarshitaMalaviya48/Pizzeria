// PrivateRoute.jsx
import { Navigate } from "react-router-dom";
// import { AuthConsumer } from "../store/auth";
import { AuthContext } from "../store/auth";
import { useContext } from "react";

export default function PrivateRoute({ children, allowedRoles }) {
  // const { token, role } = AuthConsumer();
  const { loading } = useContext(AuthContext);
  const tokenFromLocal = localStorage.getItem("token");
  const roleFromLocal = localStorage.getItem("role");
  console.log("auth in PrivateRoute tokenFromLocal",tokenFromLocal);
  console.log("auth in PrivateRoute roleFromLocal", roleFromLocal);
  // console.log("auth in PrivateRoute", token, role);
  if (loading) return <div>Checking authentication...</div>;

  if (!tokenFromLocal) {
    console.log("navigate to login page");

    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(roleFromLocal)) {
    console.log("navigate to 404 page", allowedRoles.includes(roleFromLocal));
    
    return <Navigate to="/404" replace />;
  }

  return children;
}
