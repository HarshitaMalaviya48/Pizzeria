import { Navigate } from "react-router-dom";
import { AuthConsumer } from "../store/auth";

export default function PublicRoute({ children }) {
  const { token } = AuthConsumer();
  
  // If logged in, redirect to the home page
  return !token ? children : <Navigate to="/home" />;
}