// PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { AuthConsumer } from "../store/auth";

export default function PublicRoute({ children }) {
  const { token } = AuthConsumer();
  const tokenFromLocal = localStorage.getItem("token");
  const roleFromLocal = localStorage.getItem("role");

  if (tokenFromLocal && roleFromLocal === "user") {
    console.log("101 in public route", token);

    return <Navigate to="/user/home" replace />;
  } else if (tokenFromLocal && roleFromLocal === "admin") {
    return <Navigate to="/admin/orders" replace />;
  }
  return children;
}
