import axios from "axios";
import { Link } from "react-router-dom";
import {
  Pencil,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  Phone,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ImmutableStateInvariantMiddlewareOptions } from "@reduxjs/toolkit";
import ToggleSwitch from "./Toggleswitch/Toggleswitch";
import "./Toggleswitch/Toggleswitch.css";

interface ServiceProvider {
  _id: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  imageUrl: string[];
  phoneNo: string;
  isDocumentVerifed: boolean;
}

interface UserCardProps {
  _id: number;
  name: string;
  phoneNo: string;
}

export interface ProviderChildProps {
  tittle: string;
  subtittle: string;

  modal: {
    isEditOpen: boolean;
    editingProviderId: string | null;
    setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
    closeEditModal: () => void;
    handleEditClick: (id: any) => void;
    handleItemsPerPageChange: (
      event: React.ChangeEvent<HTMLSelectElement>,
    ) => void;
    setEditingProviderId: React.Dispatch<React.SetStateAction<string | null>>;
  };

  pagination: {
    currentPage: number;
    itemsPerPage: number;
    currentItems: ServiceProvider[];
    firstIdx: number;
    lastIdx: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
    handlePageChange: (pageNumber: number) => void;
    totalPages: number;
  };

  filters: {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    showFilter: boolean;
    setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
    paid: boolean;
    setPaid: React.Dispatch<React.SetStateAction<boolean>>;
    unpaid: boolean;
    setUnpaid: React.Dispatch<React.SetStateAction<boolean>>;
    showSuggestions: boolean;
    setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
    suggestions: any[];
    setSuggestions: React.Dispatch<React.SetStateAction<any[]>>;
  };
  handleApply?: () => void;
  list: ServiceProvider[];
  isLoading: boolean;
  handleStatusUpdate?: (providerId: string, status: string) => void;
  handleDocumentApprovedSatusUpdate?: (providerId: string, status: string) => void;
  handleDelete?: (id: string, isProvider: boolean) => void;
}

const ProviderUserCard = ({
  tittle,
  subtittle,
  modal,
  pagination,
  filters,
  list,
  isLoading,
  handleStatusUpdate,
  handleDocumentApprovedSatusUpdate,
  handleApply,
  handleDelete,
}: ProviderChildProps) => {
  const [isProvider, setIsProvider] = useState(false);
  const [providers, setProviders] = useState(pagination.currentItems);
  const location = useLocation();

  useEffect(() => {
    setProviders(list);
    console.log("list");
  }, [list]);

  useEffect(() => {
    if (location.pathname.includes("all-users")) {
      setIsProvider(false);
    } else {
      setIsProvider(true);
    }
  }, [location.pathname]); // ✅ runs only when pathname changes
 

  return (
    <div className="flex-1 overflow-auto p-4 md:p-6 bg-[#F0F2FD]">
      <div className="mb-5 -mt-1">
        <h1 className="text-2xl font-bold text-gray-800">{tittle}</h1>
      </div>
      <div className="bg-white rounded-lg shadow-md">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row lg:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="mt-1 text-sm text-gray-600">{subtittle}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar with Auto-suggestions */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={
                    isProvider ? "Search Providers...." : "Search Users...."
                  }
                  value={filters.searchTerm}
                  onChange={(e) => filters.setSearchTerm(e.target.value)}
                  onFocus={() => filters.setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => filters.setShowSuggestions(false), 200)
                  }
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />

                {/* Suggestions Dropdown */}
                {filters.showSuggestions && filters.suggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filters.suggestions.map((provider, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                        onClick={() => {
                          filters.setSearchTerm(provider.name);
                          filters.setShowSuggestions(false);
                        }}
                      >
                        <span className="text-sm text-gray-800">
                          {provider.name}
                        </span>
                        {/* <span className="text-xs text-gray-500">{provider.phoneNo}</span> */}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Filter Button */}
              {isProvider && (
                <button
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => filters.setShowFilter(!filters.showFilter)}
                >
                  <Filter size={20} className="text-gray-600 mr-2" />
                  <span>Filters</span>
                </button>
              )}

              {isProvider && filters.showFilter && (
                <div className="w-full max-w-sm mx-auto p-4 bg-white shadow rounded-2xl absolute right-6 top-16 z-20 cursor-pointer">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold mb-3">Filters</h2>
                    <h2
                      className="text-sm font-thin mb-3 cursor-pointer bg-slate-100 hover:bg-slate-200 hover:font-semibold p-1 px-2 rounded-lg hover:scale-105 transition-transform duration-200 ease-in-out"
                      onClick={() => filters.setShowFilter(false)}
                    >
                      Close
                    </h2>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="paid"
                      checked={filters.paid}
                      onChange={(e) => filters.setPaid(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="paid">Paid Service Provider</label>
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="unpaid"
                      checked={filters.unpaid}
                      onChange={(e) => filters.setUnpaid(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="unpaid">Unpaid Service Provider</label>
                  </div>
                  <button
                    onClick={handleApply}
                    className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 hover:scale-105 transition-transform duration-200 ease-in-out"
                  >
                    Apply
                  </button>
                </div>
              )}
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
            <p className="mt-4 text-gray-600 font-medium">
              Loading providers...
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table
                className={`${isProvider ? "min-w-full" : "w-full"} divide-y divide-gray-200`}
              >
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sr No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {isProvider ? "Service Provider Name" : "User Name"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-xs text-left font-medium text-gray-500 uppercase tracking-wider">
                      {isProvider ? "Provider Unique ID" : "User Unique ID"}
                    </th>
                    {isProvider && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service Provider Image
                      </th>
                    )}
                    {isProvider && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    )}
                    <th
                      className={`px-6 py-3 ${isProvider ? "text-left" : "text-center"} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      Pincode
                    </th>
                    <th
                      className={`px-6 py-3 ${isProvider ? "text-left" : "text-center"} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      Document Verified
                    </th>
                    {isProvider && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subcategory
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </>
                    )}
                    {!isProvider && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {providers.map((provider: any, index) => (
                    <tr
                      key={provider?._id}
                      className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pagination.firstIdx + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-[#6362E7]">
                          {provider?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {provider?.email || "N/A"}
                        </div>
                      </td>
                      <td className="px-8 py-4 text-left whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {provider?.phoneNo || "N/A"}
                        </div>
                      </td>
                      {isProvider && (
                        <td className="px-8 py-4 whitespace-nowrap">
                          <div className="relative w-24 h-20 bg-gray-200 rounded-lg flex items-center justify-center group/image">
                            <span className="text-xs text-gray-500 absolute opacity-100 group-hover/image:opacity-0 transition-opacity">
                              View Document
                            </span>
                            <Link
                              to={`/service-provider/view/${provider._id}`}
                              className="absolute inset-0 bg-black bg-opacity-50 text-white rounded-lg opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition-opacity object-contain"
                            >
                              view
                            </Link>
                          </div>
                        </td>
                      )}
                      {isProvider && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${provider.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : provider.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                          >
                            {provider?.status}
                          </span>
                        </td>
                      )}
                      <td>
                        <div className="text-sm text-gray-900 text-center">
                          {provider.pinCode}
                        </div>
                      </td>
                      <td key={provider._id}>
                        <div>
                          {/* <ToggleSwitch
                            label=""
                            providerId={provider._id}
                            checked={provider.isDocumentVerifed}
                            onChange={handleToggle}
                          /> */}
                          <div className="container" key={provider._id}>
                            {/* Document Verified{" "} */}
                            <div className="toggle-switch">
                              <input
                                type="checkbox"
                                className="checkbox"
                                id={provider._id}
                                checked={provider.isDocumentVerifed}          // ✅ correct
                                onChange={(e) => handleDocumentApprovedSatusUpdate!(provider._id, e.target.checked?'approved':'rejected')}
                              />
                              <label className="label" htmlFor={provider._id}>
                                <span className="inner" />
                                <span className="switch" />
                              </label>
                            </div>
                          </div>
                          {/* <p>The switch is {isToggled ? "ON" : "OFF"}</p> */}
                        </div>
                      </td>
                      {isProvider && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {provider.subcategory}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {modal.isEditOpen &&
                                modal.editingProviderId ===
                                provider._id.toString() && (
                                  <div
                                    className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
                                    onClick={modal.closeEditModal}
                                  >
                                    <div
                                      className="bg-white p-8 rounded-xl w-[400px] shadow-xl"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800">
                                          Edit Provider
                                        </h2>
                                        <button
                                          onClick={modal.closeEditModal}
                                          className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                          <X size={24} />
                                        </button>
                                      </div>

                                      <div className="flex flex-col space-y-6">
                                        <div className="text-center">
                                          <h3 className="text-lg text-gray-700 font-medium">
                                            Edit Provider Verification
                                          </h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 px-4">
                                          <button
                                            className="px-4 py-3 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition-all duration-200"
                                            onClick={() => {
                                              modal.handleEditClick(
                                                provider._id.toString(),
                                              );
                                              modal.setIsEditOpen(false);
                                              handleStatusUpdate!(
                                                provider._id?.toString(),
                                                "approved",
                                              );
                                            }}
                                          >
                                            Approve
                                          </button>
                                          <button
                                            className="px-4 py-3 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
                                            onClick={() => {
                                              modal.handleEditClick(
                                                provider._id.toString(),
                                              );
                                              modal.setIsEditOpen(false);
                                              handleStatusUpdate!(
                                                provider._id.toString(),
                                                "rejected",
                                              );
                                            }}
                                          >
                                            Reject
                                          </button>
                                          {/* <button className='px-4 py-3 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200'>
                                          Edit
                                        </button> */}
                                        </div>

                                        <div className="flex justify-center pt-4">
                                          <button
                                            onClick={modal.closeEditModal}
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
                                onClick={() =>
                                  modal.handleEditClick(provider._id.toString())
                                }
                                className="p-2 bg-[#E8F8F3] text-[#38C677] rounded-full hover:bg-[#d1f3e9] transition-colors"
                              >
                                <Pencil size={16} />
                              </button>
                              {handleDelete && (
                                <button
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Are you sure you want to delete ${provider.name}?`,
                                      )
                                    ) {
                                      handleDelete(
                                        provider._id.toString(),
                                        true,
                                      );
                                    }
                                  }}
                                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                  title="Delete Provider"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </>
                      )}
                      {!isProvider && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {handleDelete && (
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Are you sure you want to delete ${provider.name}?`,
                                    )
                                  ) {
                                    handleDelete(
                                      provider._id.toString(),
                                      false,
                                    );
                                  }
                                }}
                                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                title="Delete User"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      )}
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
                    value={pagination.itemsPerPage}
                    onChange={modal.handleItemsPerPageChange}
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
                    onClick={() =>
                      pagination.handlePageChange(pagination.currentPage - 1)
                    }
                    disabled={pagination.currentPage === 1}
                    className={`p-2 rounded-md ${pagination.currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-200"
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
                    {pagination.currentPage}
                  </span>
                  <button
                    onClick={() =>
                      pagination.handlePageChange(pagination.currentPage + 1)
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`p-2 rounded-md ${pagination.currentPage === pagination.totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-200"
                      } transition-colors`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="text-sm text-gray-700">
                  Showing {pagination.firstIdx + 1} to {pagination.lastIdx} of{" "}
                  {list.length} entries
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderUserCard;
