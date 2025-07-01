import React, { useEffect, useState } from 'react';
import { Pencil, ChevronLeft, ChevronRight, Search, Filter, X, Phone } from 'lucide-react';
import Sidebar from '../../component/sidebar/sidebar';
import Navbar from '../../component/navbar/navbar';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
// import { useSetImage , useImage, useSetProviderId} from '../context';
interface ServiceProvider {
  _id: number;
  name: string; 
  status: 'pending' | 'approved' | 'rejected';
  imageUrl: string[];
  phoneNo: string;
}

const ViewProvider: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [providerList, setProviderList] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ServiceProvider[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [editingProviderId, setEditingProviderId] = useState<string | null>(null);


  // Mock data - replace with actual API call later

  // Filter providers based on search term
  const filteredProviders = providerList?.filter((provider) => {
    return (
      (typeof provider?.name === 'string' ) &&
      provider?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )});
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProviders.slice(indexOfFirstItem, indexOfLastItem);

  // Update suggestions when search term changes
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = providerList?.filter(provider => 
        provider?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, providerList]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEditClick = (providerId: string) => {
    setEditingProviderId(providerId);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingProviderId(null);
  };
  
  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const api = axios.create({
    'baseURL' : 'http://localhost:4000/api'
  })

  const handleViewDocument = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/get-provider-list`);
      if (Array.isArray(response.data?.data)) {
        setProviderList(response.data?.data);
      } else {
        console.error("Expected array of providers but got:", response.data?.data);
        setProviderList([]);
      }
    } catch (error) {
      console.error("Error fetching provider list:", error);
      setProviderList([]);
    } finally {
      setIsLoading(false);
    }
  }
  const handleStatusUpdate = async (providerId: string, status: string) => {
    try {
      const response = await api.put(`/update-provider-status/${providerId}`, { status }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("response", response)
      if (response.status === 200) {
        alert("Provider status updated successfully");
        handleViewDocument();
      } else {
        alert("Failed to update provider status");
      }
    } catch (error) {
      console.error("Error updating provider status:", error);
    }
  }

  useEffect(() => {
    handleViewDocument();
  }, []);

  return (
    <div className="flex h-screen bg-[#FFFFFF]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-auto p-4 md:p-6 bg-[#F0F2FD]">
          <div className='mb-5 -mt-1'>
                  <h1 className="text-2xl font-bold text-gray-800">Service Providers</h1>
          </div>
          <div className="bg-white rounded-lg shadow-md">
            {/* Header Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row lg:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="mt-1 text-sm text-gray-600">Manage and view all service providers</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search Bar with Auto-suggestions */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name or phone number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    
                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-10 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                        {suggestions.map((provider, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                            onClick={() => {
                              setSearchTerm(provider.name);
                              setShowSuggestions(false);
                            }}
                          >
                            <span className="text-sm text-gray-800">{provider.name}</span>
                            {/* <span className="text-xs text-gray-500">{provider.phoneNo}</span> */}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Filter Button */}
                  <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter size={20} className="text-gray-600 mr-2" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12">
                <div className="relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 border-2 border-[#6362E7] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading providers...</p>
              </div>
            ) : (
              <>
                {/* Table Section */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sr No.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service Provider Name
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provider Unique ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service Provider Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((provider, index) => (
                        <tr 
                          key={provider?._id}
                          className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 group-hover:text-[#6362E7]">
                              {provider?.name}
                            </div>
                          </td>
                          <td className="px-8 py-4 text-left whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {provider?.phoneNo || 'N/A'}
                            </div>
                          </td>
                          <td className="px-8 py-4 whitespace-nowrap">
                            <div className="relative w-24 h-20 bg-gray-200 rounded-lg flex items-center justify-center group/image">
                              <span className="text-xs text-gray-500 absolute opacity-100 group-hover/image:opacity-0 transition-opacity">View Document</span>
                              <Link to={`/service-provider/view/${provider._id}`}
                                className="absolute inset-0 bg-black bg-opacity-50 text-white rounded-lg opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition-opacity object-contain"
                              >
                                view
                              </Link>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              provider.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : provider.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {provider.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isEditOpen && editingProviderId === provider._id.toString() && (
                              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={closeEditModal}>
                                <div className="bg-white p-8 rounded-xl w-[400px] shadow-xl" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Edit Provider</h2>
                                    <button 
                                      onClick={closeEditModal}
                                      className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                      <X size={24} />
                                    </button>
                                  </div>

                                  <div className="flex flex-col space-y-6">
                                    <div className='text-center'>
                                      <h3 className="text-lg text-gray-700 font-medium">Edit Provider Verification</h3>
                                    </div>

                                    <div className='grid grid-cols-2 gap-4 px-4'>
                                      <button className='px-4 py-3 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition-all duration-200' onClick={() => {handleEditClick(provider._id.toString())
                                        setIsEditOpen(false)
                                        handleStatusUpdate(provider._id.toString(), 'approved')
                                      }}>
                                        Approve
                                      </button>
                                      <button className='px-4 py-3 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200' onClick={() => {handleEditClick(provider._id.toString())
                                        setIsEditOpen(false)
                                        handleStatusUpdate(provider._id.toString(), 'rejected')
                                      }}>
                                        Reject
                                      </button>
                                      {/* <button className='px-4 py-3 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200'>
                                        Edit
                                      </button> */}
                                    </div>

                                    <div className="flex justify-center pt-4">
                                      <button
                                        onClick={closeEditModal}
                                        className="px-8 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            <button 
                              onClick={() => handleEditClick(provider._id.toString())} 
                              className="p-2 bg-[#E8F8F3] text-[#38C677] rounded-full hover:bg-[#d1f3e9] transition-colors"
                            >
                              <Pencil size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Section */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col md:flex-row justify-between items-center     gap-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-700">Show</span>
                      <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="border rounded-md px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-[#6362E7] focus:border-transparent"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                      <span className="text-sm text-gray-700">entries</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                          currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      {/* {Array.from({ length: totalPages }, (_, i) => i + 1).map((page : any) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === page
                              ? 'bg-[#6362E7] text-white'
                              : 'text-gray-600 hover:bg-gray-200'
                          } transition-colors`}
                        >
                          {page}
                        </button>
                      ))} */}
                <span className="px-5 py-2 bg-[#6362E7] text-white font-medium rounded-lg shadow-md hover:bg-[#4f4ee0] transition-colors duration-200 cursor-pointer">
                  {currentPage}
                </span>      
                 <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${
                          currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    <div className="text-sm text-gray-700">
                      Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {filteredProviders.length} entries
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProvider;