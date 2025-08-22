import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Orders from "./pages/Orders.jsx";
import Users from "./pages/Users.jsx";
import UpdateUserProfile from "./components/UpdateUserProfile.jsx";

function App() {
  return (
    <Routes>
      <Route path="orders" element={<Orders />}></Route>
      <Route path="users" element={<Users />}></Route>
      <Route
        path="update-user-profile"
        element={<UpdateUserProfile />}
      ></Route>
      <Route path="*" element={<Navigate to="/404" replace state={{notFound: true}}/>} />
    </Routes>
  );
}


// function App() {
//  return (
//   <BrowserRouter>
//   <Routes>
//     <Route path="/orders" element={<Orders/>}></Route>
//     <Route path="/users" element={<Users/>}></Route>
//     <Route path="/update-user-profile" element={<UpdateUserProfile/>}></Route>
//   </Routes>
//   </BrowserRouter>
//  )
// }

export default App;
