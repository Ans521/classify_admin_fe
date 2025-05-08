import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhoneNumber, useSetPhoneNumber } from '../context';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import axios from 'axios';

const PhoneVerification: React.FC = () => {
  const navigate = useNavigate();
  const phoneNumber = usePhoneNumber();
  const setPhoneNumber = useSetPhoneNumber(); 

  useEffect(() => {
    // If phone number exists in context, redirect to add provider
    if (phoneNumber) {
      navigate('/service-provider/provider-add');
    }
  }, []);

  
  const api = axios.create({
    'baseURL' : 'http://localhost:4000/api'
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      
      const response = await api.post('/phone-by-admin', {
        phoneNumber,
      });
      console.log("data", response)
      if(response.status === 200){
        navigate('/service-provider/provider-add');
      }
      
    } catch (error: any) {
      console.error("Error in handleSubmit:", error.response || error.message);
      alert("Something went wrong");

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
                    onChange={(e) => setPhoneNumber(e.target.value)}
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