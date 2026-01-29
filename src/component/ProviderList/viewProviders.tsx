import React, { useEffect, useState } from 'react';
import { Pencil, ChevronLeft, ChevronRight, Search, Filter, X, Phone } from 'lucide-react';
import Sidebar from '../../component/sidebar/sidebar';
import Navbar from '../../component/navbar/navbar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProviderUserCard from '../common/ProviderUserCard';
import { useEditModal, usePagination } from '../hooks/customhook';
// import { useSetImage , useImage, useSetProviderId} from '../context';
interface ServiceProvider {
  _id: number;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  imageUrl: string[];
  phoneNo: string;
}

const ViewProvider: React.FC = () => {

  const [providerList, setProviderList] = useState<any[]>([]);
  const {
    handleEditClick,
    closeEditModal,
    isEditOpen,
    editingProviderId,
    handleItemsPerPageChange,
    setIsEditOpen,
    setEditingProviderId,
    itemsPerPage,
    setItemsPerPage
  } = useEditModal();


  const {
    showFilter,
    setShowFilter,
    paid,
    setPaid,
    unpaid,
    setUnpaid,
    showSuggestions,
    setShowSuggestions,
    searchTerm,
    setSearchTerm,
    startIdx,
    lastIdx,
    currentItems,
    handlePageChange,
    currentPage,
    setCurrentPage,
    isLoading,
    setIsLoading,
    suggestions,
    setSuggestions,
    totalPages
  } = usePagination({ list: providerList, itemsPerPage: itemsPerPage });

  const handleApply = () => {
    if (paid && unpaid) {
      handleViewDocument()
    } else if (paid) {
      const paidProviders = providerList?.filter((provider: any) => provider?.orderSubActive === true);
      console.log("paidProviders", paidProviders);
      setProviderList(paidProviders);
    } else if (unpaid) {
      const unpaidProviders = providerList?.filter((provider: any) => provider.orderSubActive == null || provider.orderSubStatus == null);
      setProviderList(unpaidProviders);
    } else if (!paid && !unpaid) {
      handleViewDocument()
    }
    setShowFilter(false);
  }
 

  const api = axios.create({
    'baseURL': 'http://82.180.144.143:4000/api'
  })

  const handleViewDocument = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/get-provider-list`);

      console.log("response", response)
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
 const handleDocumentApprovedSatusUpdate = async (providerId: string, status: string) => {
    try {
      const response = await api.put(`/approveProviderDocument/${providerId}`, { status }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("response", response)
      if (response.status === 200) {
        alert("Provider document status updated successfully");
        handleViewDocument();
      } else {
        alert("Failed to update provider document status");
      }
    } catch (error) {
      console.error("Error updating provider document status:", error);
    }
  }
  const handleDelete = async (id: string, isProvider: boolean) => {
    try {
      const endpoint = isProvider ? `/delete-provider/${id}` : `/delete-user/${id}`;
      const response = await api.delete(endpoint);
      console.log("response", response)
      if (response.status === 200) {
        alert(isProvider ? "Provider deleted successfully" : "User deleted successfully");
        handleViewDocument();
      } else {
        alert(`Failed to delete ${isProvider ? 'provider' : 'user'}`);
      }
    } catch (error) {
      console.error(`Error deleting ${isProvider ? 'provider' : 'user'}:`, error);
      alert(`Failed to delete ${isProvider ? 'provider' : 'user'}`);
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
        <ProviderUserCard
          tittle="Providers"
          subtittle="Manage provider accounts"
          modal={{
            isEditOpen,
            editingProviderId,
            setIsEditOpen,
            closeEditModal,
            handleEditClick,
            handleItemsPerPageChange,
            setEditingProviderId,
          }}
          pagination={{
            currentPage,
            itemsPerPage,
            currentItems,
            firstIdx: startIdx,
            lastIdx,
            setCurrentPage,
            setItemsPerPage,
            handlePageChange,
            totalPages
          }}
          filters={{
            searchTerm,
            setSearchTerm,
            showFilter,
            setShowFilter,
            paid,
            setPaid,
            unpaid,
            setUnpaid,
            suggestions,
            showSuggestions,
            setShowSuggestions,
            setSuggestions,
          }}
          list={providerList}
          isLoading={isLoading}
          handleStatusUpdate={handleStatusUpdate}
          handleDocumentApprovedSatusUpdate={handleDocumentApprovedSatusUpdate}
          handleApply={handleApply}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ViewProvider;