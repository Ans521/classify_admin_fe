import { useEffect, useState } from "react"


interface PaginationProps {
    itemsPerPage: number,
    list: any[],
    currentPage?: number
}
 
export const useEditModal = () => {
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [editingProviderId, setEditingProviderId] = useState<string | null>(null);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [suggestion, setSuggestion] = useState<any[]>([]);


    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleEditClick = (providerId: string) => {
        setEditingProviderId(providerId);
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
        setEditingProviderId(null);
    };

    return {
        handleEditClick,
        closeEditModal,
        isEditOpen,
        editingProviderId,
        handleItemsPerPageChange,
        setIsEditOpen,
        setEditingProviderId,
        itemsPerPage,
        setItemsPerPage,
        currentPage,
        setCurrentPage
    }
}

export const usePagination = ({ list, itemsPerPage }: PaginationProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilter, setShowFilter] = useState(false);
    const [paid, setPaid] = useState(false);
    const [unpaid, setUnpaid] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const filteredProviders = list?.filter((provider: any) => {
        return (
            (typeof provider?.name === 'string' &&
                provider?.name?.toLowerCase().includes(searchTerm.toLowerCase())) || provider?.pincode.toString().includes(searchTerm.toLowerCase())
        )
    });


    const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const lastIdx = currentPage * itemsPerPage;
    const currentItems = filteredProviders.slice(startIdx, lastIdx);


    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = list?.filter(provider =>
        provider?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

  }, [searchTerm, list]);

    return {
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
        totalPages,
        startIdx,
        lastIdx,
        currentItems,
        handlePageChange,
        currentPage,
        setCurrentPage,
        isLoading,
        setIsLoading,
        suggestions,
        setSuggestions
    }
}