import React from 'react';
import {PiDiamondsFourFill}from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineDarkMode } from "react-icons/md";
const Navbar: React.FC = () => {
  return (
    <div className="flex w-full mt-3 justify-between gap-4 p-4">
          <div className="flex-1 ml-4 cursor-pointer">
          <PiDiamondsFourFill size={26} className="text-[#6362E7]" />
          </div>
          <div className="flex gap-5 cursor-pointer mr-4">
            <FaUserCircle size={26}/>
            <MdOutlineDarkMode size={26}/>
          </div>
      </div>
  );
};

export default Navbar;
