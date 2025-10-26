import React, { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
// import { FaProjectDiagram } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAddProviderMutation, useGetAllCategoryQuery } from '../redux/api';
import { useAppSelector } from '../redux/hook';
import { useAppDispatch } from '../redux/hook';
import { setPhoneNumber } from '../redux/register';
interface FormData {
  name: string;
  category: string;
  subcategory: string;
  address: string;
  aadharAddress: string;
  pinCode: string;
  AC: null,
  ACB: null,
  PH: null,
  PC: null;
}

interface FileUrls {
  AC: any | null;
  ACB: any | null;
  PH: any | null,
  PC: any | null;
}

interface SubcategoryOptions {
  [key: string]: string[]
}

const AddProvider: React.FC = () => {
  const [addProvider] = useAddProviderMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const phoneNumber = useAppSelector((state: any) => state.register.phoneNumber);
  useEffect(() => {
    // If no phone number in context, redirect to phone verification
    if (!phoneNumber) {
      navigate('/service-provider/phone');
    }
  }, []);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("select category");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("select subcategory");

  const [options, setOptions] = useState<any[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [fileUrls, setFileUrls] = useState<FileUrls>({
    AC: null,
    ACB: null,
    PH: null,
    PC: null
  });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    aadharAddress: "",
    pinCode: "",
    category: "",
    subcategory: "",
    AC: null,
    ACB: null,
    PH: null,
    PC: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    const file = e.target.files?.[0];

    if (file) {
      const imagePreview = URL.createObjectURL(file);
      setFileUrls((prev: any) => ({ ...prev, [field]: imagePreview }));

      setFormData((prev: any) => ({ ...prev, [field]: file }));
    }
  };

  const { data, error, isLoading } = useGetAllCategoryQuery(undefined);

  useEffect(() => {
    if (data) {

      // ✅ Set main categories
      setOptions((data as any)?.data.map((item: any) => item?.category));

      // ✅ Set subcategories based on selected category
      setSubcategoryOptions(
        (data as any).data.find((item: any) => item.category === selectedCategory)?.subcategories || []
      );
    }

    if (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to fetch categories. Please try again.");
    }

    if (isLoading) {
      console.log("Loading categories...");
    }

  }, [data, error, isLoading, selectedCategory]);


  useEffect(() => {
    if (data) {
      setSubcategoryOptions((data as any).data.find((item: any) => item.category === selectedCategory)?.subcategories || []);
    }
  }, [selectedCategory, data]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          // Append file directly
         
          
          dataToSend.append(key, value);
        } else if (typeof value === "object") {
          
          dataToSend.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          
          dataToSend.append(key, value.toString());
        }
      });



      console.log("datatosend", dataToSend)

      dataToSend.append('phone', phoneNumber)
      await addProvider(dataToSend).unwrap();

      
        alert("Provider added successfully");
        setFileUrls({
          AC: null,
          ACB: null,
          PH: null,
          PC: null,
        });
        setFormData({
          name: "",
          category: "",
          subcategory: "",
          address: "",
          aadharAddress: "",
          pinCode: "",
          AC: null,
          ACB: null,
          PC:  null,
          PH: null
        });  
         navigate('/service-provider/view');
      
         dispatch(setPhoneNumber(''));

    } catch (error) {
      console.error("Error adding provider:", error);
      alert("Failed to add provider. Please try again.");
    }
  };

  const handleCategorySelect = (option: string) => {
    console.log("option", option)
    setSelectedCategory(option);
    setFormData(prev => ({ ...prev, category: option, subcategory: "" }));
    setSelectedSubcategory("select subcategory");
    setIsOpen(false);
  };

  const handleSubcategorySelect = (option: any) => {
    console.log("option", option)
    setSelectedSubcategory(option?.name);
    setFormData(prev => ({ ...prev, subcategory: option }));
    setIsSubcategoryOpen(false);
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

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Existing form fields */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      className="inline-flex justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow focus:ring-2 focus:ring-[#6362E7] focus:border-transparent focus:outline-none"
                    >
                      {selectedCategory}
                      <ChevronDown className="w-5 h-5 ml-2" />
                    </button>
                    {isOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {options.map((option, index) => (
                          <div
                            key={index}
                            onClick={() => handleCategorySelect(option)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer focus:outline-none"
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSubcategoryOpen(!isSubcategoryOpen)}
                      className="inline-flex justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow focus:ring-2 focus:ring-[#6362E7] focus:border-transparent focus:outline-none"
                      disabled={!formData.category}
                    >
                      {selectedSubcategory}
                      <ChevronDown className="w-5 h-5 ml-2" />
                    </button>
                    {isSubcategoryOpen && (
                      <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {subcategoryOptions?.map((option: any, index: any) => (
                          <div
                            key={index}
                            onClick={() => handleSubcategorySelect(option)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer focus:outline-none"
                          >
                            {option?.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                    
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent focus:outline-none"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    AadharCard Address
                    <span className="text-gray-500 text-xs ml-2">(Please enter the same address as mentioned in aadharCard)</span>
                  </label>
                  <textarea
                    name="aadharAddress"
                    value={formData.aadharAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent focus:outline-none"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent focus:outline-none"
                    placeholder="Enter pin code"
                    required
                  />
                </div>
              </div>

              {/* Document Upload Fields */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Document Uploads</h2>

                {/* Aadhar Card Front */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Aadhar Card (Front)</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'AC')}
                      className="hidden"
                      id="aadharCard"
                    />
                    <label
                      htmlFor="aadharCard"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors focus:outline-none"
                    >
                      Choose File
                    </label>
                    {fileUrls?.AC && (
                      <div className="relative w-24 h-24">
                        <img
                          src={fileUrls.AC}
                          alt="Aadhar Card Front Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, aadharCard: null }));
                            setFileUrls((prev: any) => ({ ...prev, aadharCard: null }))
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Aadhar Card Back */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Aadhar Card (Back)</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'ACB')}
                      className="hidden"
                      id="aadharCardBack"
                    />
                    <label
                      htmlFor="aadharCardBack"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors focus:outline-none"
                    >
                      Choose File
                    </label>
                    {fileUrls?.ACB && (
                      <div className="relative w-24 h-24">
                        <img
                          src={fileUrls.ACB}
                          alt="Aadhar Card Back Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, aadharCardBack: null }));
                            setFileUrls((prev: any) => ({ ...prev, aadharCardBack: null }))
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Your Photo
                    <span className="text-gray-500 text-xs ml-2">Upload your recent photograph</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'PH')}
                      className="hidden"
                      id="photo"
                    />
                    <label
                      htmlFor="photo"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors focus:outline-none"
                    >
                      Choose File
                    </label>
                    {fileUrls?.PH && (
                      <div className="relative w-24 h-24">
                        <img
                          src={fileUrls.PH}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, photo: null }));
                            setFileUrls((prev: any) => ({ ...prev, photo: null }))
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
                      onChange={(e) => handleFileChange(e, 'PC')}
                      className="hidden"
                      id="panCard"
                    />
                    <label
                      htmlFor="panCard"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors focus:outline-none"
                    >
                      Choose File
                    </label>
                    {fileUrls?.PC && (
                      <div className="relative w-24 h-24">
                        <img
                          src={fileUrls.PC}
                          alt="PAN Card Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, panCard: null }));
                            setFileUrls((prev: any) => ({ ...prev, panCard: null }))
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