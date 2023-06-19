import React from "react";
import useAdmin from "../custom-hooks/useAdmin";
import { Navigate, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
// import AllProducts from "../admin/AllProducts";

const ProtectedAdmRoutes = () => {
  const { currentUser, isAdmin } = useAdmin();

  console.log(isAdmin, 111)

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if(!isAdmin){
    return <Navigate to="/"/>
  }

  return <Outlet/>
};

export default ProtectedAdmRoutes;
