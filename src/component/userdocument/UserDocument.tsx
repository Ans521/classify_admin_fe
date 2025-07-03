import React, {useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProviderId } from "../context";
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { setProviderId } from "../redux/providerIdSlice";
import { setImage } from "../redux/imageSlice";

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
  const providerIdFromRedux = useSelector((state : any ) => state.providerId.providerId)
  const dispatch = useDispatch();
  const { id } : any = useParams();
  const documentImages = useSelector((state: any) => state.image.image);
  console.log("documentimages", documentImages)
  const [error, setError] = useState<string | null>(null);
  const documents = ["Aadhar Card", "Aadhar Card Back", "Pan Card", "Provider Photo"];
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading ] = useState<boolean>(true);

  enum DocumentType {
  'Aadhar Card' = 'AC',
  'Aadhar Card Back' ='ACB',
  'Pan Card' = "PC",
  'Provider Photo' = "PH"
  }
  console.log("enum", Object.entries(DocumentType))
  const api = axios.create({
    'baseURL' : 'http://localhost:4000/api'
  });

  const handleViewDocument = async () => {
    try {
      setIsLoading(true)
      setError(null);
      const response = await api.get(`/get-provider-list`);
      if (Array.isArray(response.data?.data)) {
        const provider = response.data?.data.find((p: Provider) => p._id === id);
        if (provider?.imageUrl) {
          dispatch(setImage(provider.imageUrl));
          dispatch(setProviderId(provider?._id));
        } else {
          dispatch(setImage([])); // setImage([]);
        }
      } else {
        console.error("Expected array of providers but got:", response.data?.data);
        dispatch(setImage([]));
      }
    } catch (error) {
      console.error("Error fetching provider list:", error);
      setError("Failed to load documents. Please try again later.");
      dispatch(setImage([])); // setImage([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleViewDocument();
  }, [id]);

  const handleCardClick = (key: any) => {
    setSelectedCard(key);
    setIsModalOpen(true);
  };


  const closeModal = () => setIsModalOpen(false);

  const handleStatus = async (action: 'approve' | 'reject') => {
    try {
      const status : any = action === 'approve' ? true : false;
      const { data } : any = await api.post('/update-status', {
        providerIdFromRedux,
        status,
      });

      if (data?.message === 'status updated successfully') {
        alert('Status updated');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

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
  console.log("documentImages object", Object.values(documentImages))
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
                {documents.map((document, index) => {
                  const key = DocumentType[document as keyof typeof DocumentType];
                  const image = documentImages[key]
                  console.log("key")
                  console.log("image", image)
                  return (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow-lg relative cursor-pointer"
                      onClick={() => handleCardClick(key)}
                    >
                      <h2 className="text-xl font-semibold mb-2">{document}</h2>
                      <div className="w-full h-60 bg-gray-200 rounded-md mb-2 flex justify-center items-center">
                        {image ? (
                          <img
                            src={image}
                            alt={document}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ):(
                          <span className="text-gray-500">No image available</span>
                        )}
                      </div>
                      <p className="p-2 text-center text-sm text-gray-600">{document}</p>
                    </div>
                      )
                })}
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
            className="w-[65%] relative bg-white p-7 rounded-lg"
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
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDocument;
