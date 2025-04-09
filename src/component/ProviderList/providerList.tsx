import React from "react";
import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/sidebar";
import { useLocation } from "react-router-dom";

const ProviderList = () => {
  const location = useLocation();
  return (
    location.pathname === "/service-provider" && (
      <div className="flex flex-col w-full h-full">
        <Navbar />
        <Sidebar />
      </div>
    )
  );
};

export default ProviderList;
