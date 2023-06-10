import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
// import Login from "../pages/Login";
import ProductDetails from "../pages/ProductDetails";
import Shop from "../pages/Shop";
// import Signup from "../pages/Signup";
import ProtectedRouters from "../routers/ProtectedRoutes";
import AddProducts from "../admin/AddProducts";
import AllProducts from "../admin/AllProducts";
import Dashboard from "../admin/Dashboard";
import Users from "../admin/Users";
import LoginPH from "../pages/LoginPH";
import UserPage from "../pages/UserPage";
import AllOrders from "../admin/AllOrders";
import MyOrders from "../pages/MyOrders";
import CancelOrders from "../admin/CancelOrders";
import DeliveredOrders from "../admin/DeliveredOrders";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />} />
      <Route path="home" element={<Home />} />
      <Route path="cart" element={<Cart />} />
      <Route path="/*" element={<ProtectedRouters />}>
        <Route path="checkout" element={<Checkout />} />
        <Route path="dashboard/add-product" element={<AddProducts />} />
        <Route path="dashboard/all-products" element={<AllProducts />} />
        <Route path="dashboard/all-orders" element={<AllOrders />} />
        <Route path="dashboard/cancel-orders" element={<CancelOrders />} />
        <Route
          path="dashboard/delivered-orders"
          element={<DeliveredOrders />}
        />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/users" element={<Users />} />
        <Route path="profile" element={<UserPage />} />
        <Route path="my-orders" element={<MyOrders />} />
      </Route>
      <Route path="login" element={<LoginPH />} />
      <Route path="shop/:id" element={<ProductDetails />} />
      <Route path="shop" element={<Shop />} />
    </Routes>
  );
};

export default Routers;
