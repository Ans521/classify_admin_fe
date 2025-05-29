import React, { useState } from 'react';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import { Plus, X } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';

const BannerCategory: React.FC = () => {
    const [banners, setBanners] = useState<{
        file: File | null;
        imageUrl: string | null;
        link: string;
    }[]>([
        { file: null, imageUrl: null, link: '' },
    ]);

    const [image, setImage] = useState<any>([]);

    const api = axios.create({
    baseURL: 'http://localhost:4000/api'
    });

    const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {        const file = e.target.files?.[0] || null;
        const newBanners = [...banners];

        newBanners[index].file = file;
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            const {data} : any = await api.post('/upload-image', formData, {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            });
        
        newBanners[index].imageUrl = data.data ? data.data: null;
        setBanners(newBanners);
        }
    }

  const handleLinkChange = (index: number, value: string) => {
    const newBanners = [...banners];
    newBanners[index].link = value;
    setBanners(newBanners);
  };

    const addNewBanner = () => {
      setBanners([...banners, { file: null, imageUrl: null, link: '' }]);
    };

    const removeImage = (idx: number) => {
        setBanners(banners.filter((_, index) => index !== idx));
    };

    useEffect(() => {
        console.log(banners);
    }, [banners]);

    const handleUploadBanners = async () => {
      try{
        const banner = banners.map((banner : any) => {
          return {
            imageUrl : banner.imageUrl,
            link : banner.link
          }
        })
        const response : any = await api.post('/add-banner', {data : banner})

        if(response.status === 200){
          alert("Banners added successfully");
          setBanners([{ file: null, imageUrl: null, link: '' }]);
        }
      }catch(error){
        console.log(error);
     }
    }
  return (
    <div className="flex h-screen w-full bg-[#FFFFFF]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto h-full w-full">
        <Navbar />
        <div className="p-10 space-y-8">
          {banners.map((banner, index) => (
            <div key={index} className="flex flex-col gap-4">
                <div className='flex gap-4'>
                    <label htmlFor={`banner-upload-${index}`} className="border border-gray-300 rounded p-4 w-fit cursor-pointer">
                        {banner.imageUrl ? (
                        <img
                            src={banner.imageUrl}
                            alt="Banner preview"
                            className="max-w-xs max-h-40 rounded object-contain"
                        />
                        ) : (
                        <span className="text-sm text-gray-700">Upload Banner</span>
                        )}
                    </label>
                    <button className="bg-slate-100  hover:bg-slate-300 text-white rounded-xl p-2 w-fit h-fit flex items-center justify-center"  onClick={() => removeImage(index)}>
                        <X size={18} className='text-black' />
                    </button>
                </div>
              <input
                type="file"
                id={`banner-upload-${index}`}
                accept="image/*"
                onChange={(e) => handleFileChange(index, e)}
                className="hidden"
              />
              <input
                type="text"
                placeholder="Enter banner link"
                value={banner.link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full max-w-md"
              />
            </div>
          ))}

          <button
            onClick={addNewBanner}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Plus size={18} /> Add Another Banner
          </button>

          <div className="mt-8 flex flex-col items-center gap-4">
            {/* <button
              onClick={() => alert('Upload Advertisement clicked')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Upload Advertisement
            </button> */}

            <button
              onClick={handleUploadBanners}
              className="bg-purple-600 w-full mb-10 text-white px-4 py-2 rounded-xl hover:bg-purple-700 hover:shadow-lg transition duration-300 ease-in-out hover:rotate-[1deg]"
            >
              Upload Banners
            </button>
          </div>    
        </div>
        <div className="flex items-center gap-4 px-8 mb-10">
            <img
              src="https://images.unsplash.com/photo-1520342868574-5fa3804e551c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              alt="Ansh Sharma"
              className="w-60 h-60 rounded-lg"
            />
            <input type="text" placeholder="hello" className="w-full h-10 border px-3 rounded" />
          </div>
      </div>
    </div>
  )

};

export default BannerCategory;
