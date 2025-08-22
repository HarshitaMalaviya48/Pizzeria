import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import UpdateProfile from "./pages/UpdateProfile";
import Order from "./pages/Order";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import { CartProvider } from "./store/CartContext.jsx";

function AppLayout() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route
          path="*"
          element={<Navigate to="/404" replace state={{ notFound: true }} />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <AppLayout />;
    </CartProvider>
  );
}


// function AppLayout() {
//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/home" element={<Home />} />
//           <Route path="/cart" element={<Cart />} />
//           <Route path="/update-profile" element={<UpdateProfile />} />
//           <Route path="/orders" element={<Order />} />
//           <Route path="/success" element={<Success />} />
//           <Route path="/cancel" element={<Cancel />} />
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

export default App;