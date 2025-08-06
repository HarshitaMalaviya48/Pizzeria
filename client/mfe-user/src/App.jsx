import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import UpdateProfile from "./pages/UpdateProfile";


// function AppLayout() {
//   return (
//     <>
//     <Routes>
//       <Route path="/home" element={<Home />} />
//       <Route path="/cart" element={<Cart />} />
//       <Route path="/update-profile" element={<UpdateProfile />} />
//        <Route path="*" element={<Navigate to="/404" replace state={{notFound: true}}/>} />
//     </Routes>
//   </> 
//   )
// }

// function App() {
//   return <AppLayout />;
// }

export default App;


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
