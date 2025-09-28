import React, { useEffect, useState } from 'react';
import { Pencil, ChevronLeft, ChevronRight, Search, Filter, X, Phone } from 'lucide-react';
import Sidebar from '../../component/sidebar/sidebar';
import Navbar from '../../component/navbar/navbar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProviderUserCard from '../common/ProviderUserCard';
import { useEditModal, usePagination } from '../hooks/customhook';


const UserView : React.FC = () => {
    const [userList, setUserList] = useState<any[]>([]);
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
    } = usePagination({ list: userList, itemsPerPage: itemsPerPage });

    const api = axios.create({
        'baseURL': 'http://82.180.144.143:4000/api'
    })

    const handleViewDocument = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/get-all-users`);
            console.log("response", response)
            if (Array.isArray(response.data?.data)) {
                setUserList(response.data?.data);
            } else {
                console.error("Expected array of providers but got:", response.data?.data);
                setUserList([]);
            }
        } catch (error) {
            console.error("Error fetching provider list:", error);
            setUserList([]);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        handleViewDocument();
    }, [])
    return (
        <div className="flex h-screen bg-[#FFFFFF]">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <ProviderUserCard
                    tittle="Providers"
                    subtittle="Manage User accounts"
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
                    list={userList}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}

export default UserView