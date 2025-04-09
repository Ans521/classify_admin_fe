import React, { useState } from 'react';
import { ChevronDown, Eye, EyeOff, X } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import axios from 'axios';
// import { FaProjectDiagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  // phoneNo: string;
  password: string;
  mpin: string;
  address: string;
  aadharCard: File | null;
  drivingLicense: File | null;
  panCard: File | null;
}

const AddProvider: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    // phoneNo: "",
    address: "",
    password: "",
    mpin: "",
    aadharCard: null,
    drivingLicense: null,
    panCard: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showMpin, setShowMpin] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<{
    aadharCard: string | null;
    drivingLicense: string | null;
    panCard: string | null;
  }>({
    aadharCard: null,
    drivingLicense: null,
    panCard: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof previewUrls) => {
    const file = e.target.files?.[0];
    if (file) {
      // setFormData((prev) => ({ ...prev, [field]: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const api = axios.create({
    'baseURL' : 'http://13.202.163.238:4000/api'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // const formDataToSend = new FormData();
      // Object.entries(formData).forEach(([key, value]) => {
      //   if (value !== null) {
      //     formDataToSend.append(key, value);
      //   }
      // });
      if(formData.mpin !== formData.password){
        alert("Mpin do not match");
        return;
      }
      console.log(formData);
      const response = await api.post("/add-provider", formData);
      if (response?.status === 200) {
        alert("Provider added successfully");
        // Reset form
        setFormData({
          name: "",
          email: "",
          // phoneNo: "",
          password: "",
          mpin: "",
          address: "",
          aadharCard: null,
          drivingLicense: null,
          panCard: null,
        });
        setPreviewUrls({
          aadharCard: null,
          drivingLicense: null,
          panCard: null,
        });
      }
    } catch (error) {
      console.error("Error adding provider:", error);
      alert("Failed to add provider. Please try again.");
    }
  };


  return (
    <div className="flex h-screen bg-[#FFFFFF]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto bg-[#F0F2FD] p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Add New Provider</h1>
              <p className="text-gray-600 text-center">Fill in the details to register a new service provider</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Existing form fields */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent"
                    required
                  />
                </div> */}

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    MPIN (Optional)
                    <span className="text-gray-500 text-xs ml-2">For additional security</span>
                  </label>                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MPIN (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type={showMpin ? "text" : "password"}
                      name="mpin"
                      value={formData.mpin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMpin(!showMpin)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showMpin ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Document Upload Fields */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Document Uploads</h2>
                
                {/* Aadhar Card */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Aadhar Card</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'aadharCard')}
                      className="hidden"
                      id="aadharCard"
                    />
                    <label
                      htmlFor="aadharCard"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      Choose File
                    </label>
                    {previewUrls.aadharCard && (
                      <div className="relative w-24 h-24">
                        <img
                          src={previewUrls.aadharCard}
                          alt="Aadhar Card Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, aadharCard: null }));
                            setPreviewUrls(prev => ({ ...prev, aadharCard: null }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Driving License */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Driving License (Optional)
                    <span className="text-gray-500 text-xs ml-2">Upload if available</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'drivingLicense')}
                      className="hidden"
                      id="drivingLicense"
                    />
                    <label
                      htmlFor="drivingLicense"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      Choose File
                    </label>
                    {previewUrls.drivingLicense && (
                      <div className="relative w-24 h-24">
                        <img
                          src={previewUrls.drivingLicense}
                          alt="Driving License Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, drivingLicense: null }));
                            setPreviewUrls(prev => ({ ...prev, drivingLicense: null }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* PAN Card */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">PAN Card</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'panCard')}
                      className="hidden"
                      id="panCard"
                    />
                    <label
                      htmlFor="panCard"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      Choose File
                    </label>
                    {previewUrls.panCard && (
                      <div className="relative w-24 h-24">
                        <img
                          src={previewUrls.panCard}
                          alt="PAN Card Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, panCard: null }));
                            setPreviewUrls(prev => ({ ...prev, panCard: null }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#6362E7] text-white font-semibold rounded-lg shadow-md hover:bg-[#5251c7] focus:outline-none focus:ring-2 focus:ring-[#6362E7] focus:ring-opacity-50 transform transition-all duration-300 hover:scale-105"
                >
                  Add Provider
                </button>
                <Link
                  to="/service-provider/view"
                  className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transform transition-all duration-300 hover:scale-105"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProvider; 