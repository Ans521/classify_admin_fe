import React from "react";
import { useLocation } from "react-router-dom";
import {
  DollarSign,
  Users,
  ShoppingCart,
  Briefcase,
  MessageCircle,
  Star,
  Globe,
  Calendar,
  FileText,
  Activity,
} from "lucide-react";
import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/sidebar";

const Dashboard: React.FC = () => {
  const location = useLocation();

  if (location.pathname !== "/") return null;

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="w-full min-h-screen overflow-y-auto bg-[#F0F2FD] p-4">
          <div className="text-2xl px-2 py-4 font-bold">DashBoard</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-20 mt-1">
            {[
              { title: "Total Revenue", amount: "$12", icon: <DollarSign size={28} color="#3B82F6" /> },
              { title: "Total Users", amount: "120", icon: <Users size={28} color="#3B82F6" /> },
              { title: "New Orders", amount: "45", icon: <ShoppingCart size={28} color="#3B82F6" /> },
              { title: "Active Plans", amount: "8", icon: <Briefcase size={28} color="#3B82F6" /> },
              { title: "Feedbacks", amount: "32", icon: <MessageCircle size={28} color="#3B82F6" /> },
              { title: "Ratings", amount: "4.5", icon: <Star size={28} color="#3B82F6" /> },
              { title: "Global Reach", amount: "15+", icon: <Globe size={28} color="#3B82F6" /> },
              { title: "Active Users", amount: "250+", icon: <Users size={28} color="#3B82F6" /> },
              { title: "Total Sales", amount: "$2.5K", icon: <DollarSign size={28} color="#3B82F6" /> },
              { title: "New Clients", amount: "85", icon: <Briefcase size={28} color="#3B82F6" /> },
              { title: "Messages", amount: "124", icon: <MessageCircle size={28} color="#3B82F6" /> },
              { title: "Global Users", amount: "1.2K", icon: <Globe size={28} color="#3B82F6" /> },
              { title: "Events", amount: "3", icon: <Calendar size={28} color="#3B82F6" /> },
              { title: "Reports", amount: "27", icon: <FileText size={28} color="#3B82F6" /> },
              { title: "Performance", amount: "95%", icon: <Activity size={28} color="#3B82F6" /> },
            ].map((card, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-center items-center text-center bg-white rounded-2xl p-8 shadow-md transition-all duration-300 hover:translate-y-[-10px] cursor-pointer mb-4"
              >
                <div className="mb-0.5">{card.icon}</div>
                <div className="text-lg font-semibold text-[#3B82F6] mb-2">{card.title}</div>
                <div className="text-2xl font-bold">{card.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
