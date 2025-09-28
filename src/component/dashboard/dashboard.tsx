import React, { useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Bell
} from "lucide-react";
import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/sidebar";
import { useGetCountQuery } from "../redux/api";
import { link } from "fs";

const Dashboard: React.FC = () => {
  const location = useLocation();

  const [userCount, setUserCount] = React.useState();
  const [providerCount, setProviderCount] = React.useState();
  const [offerCount, setOfferCount] = React.useState();
  const [generalNotifyCount, setGeneralNotifyCount] = React.useState();

  // const api = axios.create({
  //   baseURL: 'http://82.180.144.143:4000/api'
  // });

  // const token = localStorage.getItem("token");
  // const fetchData = async () => {
  //   const { data } = await api.get('/count', {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //   // setCount(data);
  //   console.log("data", data);
  // }

  const { data } = useGetCountQuery(undefined, { refetchOnMountOrArgChange: true });
  
  useEffect(() => {
    if (!data || !Array.isArray((data as any).data?.baseCounts)) {
    console.log("Unexpected data shape:", data);
    return;
  }

    (data as any).data?.baseCounts?.forEach((item: any) => {
      switch (item._id) {
        case "User": setUserCount(item.total);
          break;
        case "ServiceProvider": setProviderCount(item.total);
          break;
        default:
          break;
      }
    })
    if (Array.isArray((data as any).data?.offerCount) && (data as any).data?.offerCount[0]) {
    setOfferCount((data as any).data?.offerCount[0].total);
  }

    if (Array.isArray((data as any).data?.notifyCount) && (data as any).data?.notifyCount[0]) {
      setGeneralNotifyCount((data as any).data?.notifyCount[0].total);
  }
  }, [data])


  console.log("userCount", userCount);
  console.log("providerCount", providerCount);
  console.log("offerCount", offerCount);
  console.log("generalNotifyCount", generalNotifyCount);
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
              { title: "Users", count: userCount, icon: <Users size={28} color="#3B82F6" />, link : '/' },
              { title: "Provider", count: providerCount, icon: <Users size={28} color="#3B82F6" />, link : '/' },
              { title: "Total Users", count : userCount! + providerCount!, icon: <Users size={28} color="#3B82F6" />, link : '/'  },
              { title: "Active Plans", count: offerCount, icon: <Bell size={28} color="#3B82F6" />, link : "/offers" },
              { title: "Total Notification Sent", count: generalNotifyCount, icon: <Bell size={28} color="#3B82F6" />, link : "/general-notify" },
              // { title: "Messages", amount: "124", icon: <MessageCircle size={28} color="#3B82F6" /> },
              // { title: "Global Users", amount: "1.2K", icon: <Globe size={28} color="#3B82F6" /> },
              // { title: "Events", amount: "3", icon: <Calendar size={28} color="#3B82F6" /> },
              // { title: "Reports", amount: "27", icon: <FileText size={28} color="#3B82F6" /> },
              // { title: "Performance", amount: "95%", icon: <Activity size={28} color="#3B82F6" /> },
            ].map((card: any, idx) => (
              <Link
              to={card?.link}
                key={idx}
                className="flex flex-col justify-center items-center text-center bg-white rounded-2xl p-8 shadow-md transition-all duration-300 hover:translate-y-[-10px] cursor-pointer mb-4"
              >
                <div className="mb-0.5">{card.icon}</div>
                <div className="text-2xl">{card.Link}</div>
                <div className="text-lg font-semibold text-[#3B82F6] mb-2">{card.title}</div>
                <div className="text-2xl font-bold">{card.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
