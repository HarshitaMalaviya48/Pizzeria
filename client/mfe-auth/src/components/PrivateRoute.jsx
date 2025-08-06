import { Navigate } from "react-router-dom";
import { AuthConsumer } from "../store/auth";

export default function PrivateRoute({ children }) {
  const { token } = AuthConsumer();
  // If not logged in, redirect to login page
  return token ? children : <Navigate to="/login" />;
}