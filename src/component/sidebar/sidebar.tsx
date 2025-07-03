import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Image,
  List,
  Map,
  CreditCard,
  Tag,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import path from "path";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-[22%] bg-white text-black shadow-lg flex flex-col h-screen">
      
      <div className="px-5 mt-5 text-2xl font-semibold">Clasify</div>
      
      <div className="overflow-y-auto flex-1 mt-4">
        <nav className="p-4 flex flex-col space-y-4">
          {[
            { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
            { name: "Banner", path: "/banner", icon: <Image size={20} /> },
            {name : "Offers", path : "/offers", icon : <Tag size={20}/>},
            { name: "Category", path: "/category", icon: <List size={20} /> },
            { name: "Service Zone", path: "/service-zone", icon: <Map size={20} /> },
            { name: "Payment Method", path: "/payment-method", icon: <CreditCard size={20} /> },
            { name: "Provider Category", path: "/provider-category", icon: <Tag size={20} /> },
            { name: "Revenue", path: "/revenue", icon: <DollarSign size={20} /> },
            { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
          ].map((item, index) => (
            <div key={index}>
              {item.name === "Service Zone" ? (
                <div>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-300 ${
                      location.pathname.includes("/service-zone") || location.pathname.includes("/service-provider")
                        ? "bg-[#e3e9fe] font-medium text-[#6362E7]"
                        : "text-black hover:bg-[#dde2f6] font-medium"
                    }`}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </div>
                    {isOpen ? <ChevronUp size={20}/> : <ChevronDown size={20} />}
                  </button>
                  {isOpen && (
                    <div className="ml-8 mt-1 space-y-2">
                      <Link
                        to="/service-provider/phone"
                        className={`block px-3 py-2 rounded-lg transition-all ${
                          location.pathname === "/service-provider/phone"
                            ? "bg-[#e3e9fe] text-[#6362E7]"
                            : "text-black hover:bg-[#dde2f6]"
                        }`}
                      >
                        Add Provider
                      </Link>
                      <Link
                        to="/service-provider/view"
                        className={`block px-3 py-2 rounded-lg transition-all ${
                          location.pathname === "/service-provider/view"
                            ? "bg-[#e3e9fe] text-[#6362E7]"
                            : "text-black hover:bg-[#dde2f6]"
                        }`}
                      >
                        View Provider
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? "bg-[#e3e9fe] font-medium text-[#6362E7]"
                      : "text-black hover:bg-[#dde2f6] font-medium"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
