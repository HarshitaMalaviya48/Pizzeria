import { Route, Routes, Navigate } from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {BrowserRouter} from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import { AuthProvider } from "./store/auth";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/404" replace state={{notFound: true}}/>} />
    </Routes>
  );
}

export default function App(){
  return (
   
    <AuthProvider>
      <AppRoutes/>
       <ToastContainer/>
    </AuthProvider>

  )
}


// function App() {
//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<SignUp />}></Route>
//           <Route path="/login" element={<Login />}></Route>
//           <Route path="/forgot-password" element={<ForgotPassword />}></Route>
//           <Route path="/reset-password/:token" element={<ResetPassword />}></Route>
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;
