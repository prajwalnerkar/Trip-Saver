import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import StoreDetail from "../pages/StoreDetail";
import ReserveItem from "../pages/ReserveItem";
import Profile from "../pages/Profile";
import Search from "../pages/Search";
import Notification from "../pages/Notification";
import AddProduct from "../pages/AddProduct";
import Login from "../pages/Login";
import Register from "../pages/Register";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/store" element={<StoreDetail />} />
      <Route path="/search" element={<Search />} />

      <Route path="/reserve" element={<ReserveItem />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="/add" element={<AddProduct />} />
    </Routes>
  );
}

export default AppRoutes;
