import React, {useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProviderId, useImage, useSetImage, useSetProviderId } from "../context";
import axios from 'axios';

interface Provider {
  _id: string;
  name: string;
  imageUrl: ImageUrl;
  // Add other properties as needed
}
interface ImageUrl {
  AC : string;
  ACB : string;
  PC : string;
  PH : string;
}

const UserDocument: React.FC = () => {
  const providerId = useProviderId();
  const setProviderId = useSetProviderId();
  const { id } : any = useParams();
  const documentImages = useImage();
  const setImage = useSetImage();
  const [error, setError] = useState<string | null>(null);

  const documents = ["Aadhar Card", "Aadhar Card Back", "Pan Card", "Provider Photo"];
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading ] = useState<boolean>(true);

  const api = axios.create({
    'baseURL' : 'http://182.180.144.143:4000/api'
  });

  const handleViewDocument = async () => {
    try {
      setIsLoading(true)
      setError(null);
      const response = await api.get(`/get-provider-list`);
      if (Array.isArray(response.data?.data)) {
        const provider = response.data?.data.find((p: Provider) => p._id === id);
        console.log("providerda", provider)
        if (provider?.imageUrl) {
          setImage(provider.imageUrl);
          setProviderId(provider?._id);
        } else {
          setImage([]);
        }
      } else {
        console.error("Expected array of providers but got:", response.data?.data);
        setImage([]);
      }
    } catch (error) {
      console.error("Error fetching provider list:", error);
      setError("Failed to load documents. Please try again later.");
      setImage([]);
    } finally {
      setIsLoading(false);
    }
  };
console.log("documentImages", documentImages)
  useEffect(() => {
    handleViewDocument();
  }, [id]);

  const handleCardClick = (index: number) => {
    setSelectedCard(index);
    setIsModalOpen(true);
  };


  const closeModal = () => setIsModalOpen(false);

  // const updateLocalStorage = (key: string, data: number[]) => {
  //   localStorage.setItem(`${key}_${provideId}`, JSON.stringify(data));
  // };

  // const handleAction = (action: "approve" | "reject") => {
  //   if (selectedCard !== null) {
  //     const cardId = provideId + selectedCard;
  //     if (
  //       !approvedCards.includes(cardId) &&
  //       !rejectedCards.includes(cardId)
  //     ) {
  //       const updatedList = action === 'approve' ? [...approvedCards, cardId] : [...rejectedCards, cardId]
  //       action === "approve"
  //         ? setApprovedCards(updatedList)
  //         : setRejectedCards(updatedList);

  //       updateLocalStorage(
  //         action === "approve" ? "approvedCards" : "rejectedCards",
  //         updatedList
  //       );
  //     }
  //   }
  //   closeModal();
  // };

  // const getStatusLabel = (index: number) => {
  //   const cardId = provideId + index;
  //   if (approvedCards.includes(cardId)) {
  //     return (
  //       <div className="absolute top-2 right-4 bg-green-500 text-white text-sm px-2 py-1 rounded">
  //         Approved
  //       </div>
  //     );
  //   } else if (rejectedCards.includes(cardId)) {
  //     return (
  //       <div className="absolute top-2 right-4 bg-red-500 text-white text-sm px-2 py-1 rounded">
  //         Rejected
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div className="absolute top-2 right-4 bg-yellow-500 text-white text-sm px-2 py-1 rounded">
  //         Pending
  //       </div>
  //     );
  //   }
  // };

  const handleStatus = async (action: 'approve' | 'reject') => {
    try {
      const status : any = action === 'approve' ? true : false;
      const { data } : any = await api.post('/update-status', {
        providerId,
        status,
      });

      if (data?.message === 'status updated successfully') {
        alert('Status updated');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // console.log()
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6362E7] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={handleViewDocument}
            className="mt-4 px-4 py-2 bg-[#6362E7] text-white rounded-lg hover:bg-[#5251c7]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Application Document</h1>
          <div className="w-full max-w-3xl"> 
            {(!documentImages || documentImages.length === 0) ? (
              <div className="text-center text-gray-600 p-4">
                <h2>No documents uploaded yet</h2>
              </div>
            ) : (
              <div className="space-y-6">
                {documents.map((document, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-lg relative cursor-pointer"
                    onClick={() => handleCardClick(index)}
                  >
                    <h2 className="text-xl font-semibold mb-2">{document}</h2>
                    <div className="w-full h-60 bg-gray-200 rounded-md mb-2 flex justify-center items-center">
                      {Object.values(documentImages).length > 0 ? (
                        Object.values(documentImages).map((value : any, index : any) => (
                          <img
                            key={index}
                            src={value}
                            alt={document}
                            className="object-contain w-full h-full rounded-md"
                            onClick={() => handleCardClick(index) }
                          />
                        ))):(
                        <span className="text-gray-500">No image available</span>
                      )}
                    </div>
                    <p className="p-2 text-center text-sm text-gray-600">{document}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center items-center space-x-8 mt-6">
              <Link 
                to={'/service-provider/view'}
                className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                onClick={() => handleStatus('approve')}
              >
                Approve
              </Link>
              <Link 
                to={'/service-provider/view'} 
                className="px-8 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                onClick={() => handleStatus('reject')}
              >
                Reject
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedCard !== null && documentImages[selectedCard] && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-55 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="w-[65%] bg-white p-7 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center">
              <h2 className="text-xl text-center font-semibold mb-3 -mt-3">
                {documents[selectedCard]}
              </h2>
            </div>
            <img
              src={documentImages[selectedCard]}
              alt="Selected Document"
              className="object-contain w-full h-96 rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDocument;
