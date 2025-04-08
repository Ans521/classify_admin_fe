import React, { useState } from 'react';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  subCategory: string;
  mpin: string;
  mpinVerify: string;
}

const AddProvider: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    category: '',
    subCategory: '',
    mpin: '',
    mpinVerify: ''
  });

  const [showMpin, setShowMpin] = useState(false);
  const [showMpinVerify, setShowMpinVerify] = useState(false);

  // Mock data for dropdowns
  const categories = ['Salon', 'Spa', 'Wellness', 'Beauty'];
  const subCategories = ['Hair Care', 'Skin Care', 'Massage', 'Nail Care'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.mpin !== formData.mpinVerify){
      alert('MPINs do not match');
      return;
    }
  };

  return (
    <div className="flex h-screen bg-[#FFFFFF]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto bg-[#F0F2FD] p-6">
          <div className="mb-4 ml-20">
            <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Complete Profile</h1>
          </div>
          
          {/* Form Container */}
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-[#6362E7] focus:border-[#6362E7]"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-[#6362E7] focus:border-[#6362E7]"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-[#6362E7] focus:border-[#6362E7]"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Address Input */}
              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-[#6362E7] focus:border-[#6362E7]"
                    placeholder="Enter your address"
                    required
                  />
                </div>
              </div>

              {/* MPIN Input */}
              <div className="space-y-2">
                <label htmlFor="mpin" className="block text-sm font-medium text-gray-700">
                  MPIN <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type={showMpin ? "text" : "password"}
                    id="mpin"
                    name="mpin"
                    value={formData.mpin}
                    onChange={handleChange}
                    maxLength={4}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-[#6362E7] focus:border-[#6362E7]"
                    placeholder="Enter 4-digit MPIN"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMpin(!showMpin)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showMpin ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Set a 4-digit MPIN for quick access</p>
              </div>

              {/* MPIN Verification Input */}
              <div className="space-y-2">
                <label htmlFor="mpinVerify" className="block text-sm font-medium text-gray-700">
                  Verify MPIN <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type={showMpinVerify ? "text" : "password"}
                    id="mpinVerify"
                    name="mpinVerify"
                    value={formData.mpinVerify}
                    onChange={handleChange}
                    maxLength={4}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-[#6362E7] focus:border-[#6362E7]"
                    placeholder="Verify your 4-digit MPIN"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMpinVerify(!showMpinVerify)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showMpinVerify ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Re-enter your MPIN to verify</p>
              </div>

              {/* Category Dropdown */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none outline-none transition-all duration-200 focus:ring-2 focus:ring-[#6362E7] focus:border-[#6362E7]"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Sub Category Dropdown */}
              <div className="space-y-2">
                <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
                  Sub Category
                </label>
                <div className="relative">
                  <select
                    id="subCategory"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none outline-none transition-all duration-200 focus:ring-2 focus:ring-[#6362E7] focus:border-[#6362E7]"
                    required
                  >
                    <option value="">Select a sub category</option>
                    {subCategories.map((subCategory) => (
                      <option key={subCategory} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-[#6362E7] text-white py-2.5 px-4 rounded-lg hover:bg-[#5251c7] transition-all duration-200 outline-none focus:ring-2 focus:ring-[#6362E7] focus:ring-offset-2"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProvider; 