


import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { lazy, Suspense } from "react";
import PrivateRoute from "remote_auth_app/components/PrivateRoute";
import PublicRoute from "remote_auth_app/components/PublicRoute";
import { AuthProvider } from "remote_auth_app/store/auth";
import NotFound from "./pages/NotFound";
import {ToastContainer} from "react-toastify";
// import { RemoteUserApp } from "./remoteModule";

const RemoteAuthApp = lazy(() => import("remote_auth_app/App"));
const RemoteUserApp = lazy(() => import("remote_user_app/App"));
const RemoteAdminApp = lazy(() => import("remote_admin_app/App"));

function AppLayout() {
  const location = useLocation();
  // const hideNavbarRoutes = ["/reset-password", "/reset-password/:token"];
  const shouldHideNavbar = location.pathname.startsWith("/reset-password") || location.state?.notFound || location.pathname.startsWith("/user/success") || location.pathname.startsWith("/user/cancel")
  console.log("-----------location", location);
  

  return (
    <>
   
        {!shouldHideNavbar && <Navbar />}
        <Suspense fallback={<div>Loading ....</div>}>
          <Routes>
            <Route
              path="/home"
              element={<Navigate to="/user/home" replace />}
            />
             <Route path="/404" element={<NotFound/>} />
            <Route
              path="/*"
              element={
                <PublicRoute>
                  <RemoteAuthApp />
                </PublicRoute>
              }
            />
              <Route
                path="/admin/*"
                element={
                  <PrivateRoute allowedRoles={["admin"]}>
                    <RemoteAdminApp />
                  </PrivateRoute>
                }
              />
            <Route
              path="/user/*"
              element={
                <PrivateRoute allowedRoles={["user"]}>
                  <RemoteUserApp />
                </PrivateRoute>
              }
            />
            
          </Routes>
          
        </Suspense>
   
      <Routes>
       
      </Routes>{" "}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
         <ToastContainer/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
