import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { setEmail, setPhoneNumber } from '../redux/register';

const PhoneVerification: React.FC = () => {
  const navigate = useNavigate();
  const phoneNumber = useAppSelector((state : any) =>  state.register.phoneNumber)
  const email = useAppSelector((state : any) =>  state.register.email);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("Phone Number:", phoneNumber);
    console.log("Email:", email);
    if (phoneNumber || email) {
      navigate('/service-provider/provider-add');
    }
  }, []);

  const api = axios.create({
    'baseURL' : 'http://82.180.144.143:4000/api'
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      
      const response = await api.post('/phone-by-admin', {
        phoneNumber,
        email
      });

      console.log("Response:", response);

      if(response.status === 200){
        navigate('/service-provider/provider-add');
      }    
    } catch (error: any) {
      console.error("Error in handleSubmit:", error.response.data.data.message);
      alert(""+error.response.data.data.message);
    }
  };

  return (
    <div className="flex h-screen bg-[#FFFFFF]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto bg-[#F0F2FD] p-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
              <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Provider Verification</h1>
              <p className="text-gray-600 text-center mb-8">Enter phone number to proceed</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent focus:outline-none"
                    placeholder="Enter phone number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Please enter a 10-digit phone number
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="tel"
                    value={email}
                    onChange={(e) => dispatch(setEmail(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent focus:outline-none"
                    placeholder="Enter provider email"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Please enter provider email
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#6362E7] text-white font-semibold rounded-lg shadow-md hover:bg-[#5251c7] focus:outline-none focus:ring-2 focus:ring-[#6362E7] focus:ring-opacity-50 transform transition-all duration-300 hover:scale-105"
                >
                  Proceed
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification; 