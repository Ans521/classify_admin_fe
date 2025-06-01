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
        id? : string
    }[]>([
        {file: null, imageUrl: null, link: '' },
    ]);


    const [isEditMode, setIsEditMode] = useState(false);

    const [bannerList, setBannerList] = useState<any[]>([]);

    const api = axios.create({
    baseURL: 'http://82.180.144.143:4000/api'
    });

    const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {        const file = e.target.files?.[0] || null;
        const newBanners = [...banners];
        console.log("new banners", newBanners)
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
        getBanners();
    }, [banners]);

    const handleUploadBanners = async (id? : string) => {
      try{
        const banner = banners.map((banner : any) => {
          return {
            _id : banner.id,
            imageUrl : banner.imageUrl,
            link : banner.link
          }
        })
        if(isEditMode){
          console.log("bannersaa", banner)
          const response : any = await api.put('/update-banner', {data : banner})
          if(response.status === 200){
            alert("Banners updated successfully");
            setBanners([{ file: null, imageUrl: null, link: '' }]);
            setIsEditMode(false)
          }
        }else{
          const response : any = await api.post('/add-banner', {data : banner})
          if(response.status === 200){
            alert("Banners added successfully");
            setBanners([{ file: null, imageUrl: null, link: '' }]);
          }
        }
      }catch(error){
        console.log(error);
     }
    }

    const getBanners = async () => {
      try{
        const response : any = await api.get('/get-all-banner');
        if(response.status === 200){
          console.log("response.data.data", response.data.data)
          setBannerList(response.data.data);
        }
      }catch(error){
        console.log(error);
      }
    }

    const editBanner = (id : string, imageUrl : string, link : string) => {
      setBanners([{id : id, file : null, imageUrl, link}]);
      setIsEditMode(true);
    }

    const removeBanner = async (id : string) => {
        try {
          const response : any = await  api.delete('/delete-banner?id=' + id);

          if(response.status === 200){
            alert("Banner deleted successfully");
            await getBanners();
            setIsEditMode(false);
            setBanners([{ file: null, imageUrl: null, link: '' }]);
          }
        } catch (error) {
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
                <div className='flex relative gap-4'>
                    <label htmlFor={`banner-upload-${index}`} className="border border-gray-300 rounded p-4 w-fit cursor-pointer">
                        {banner.imageUrl ? (
                        <img
                            src={banner.imageUrl}
                            alt="Banner preview"
                            className={`max-w-xs max-h-40 rounded object-contain`}
                        />
                        ) : (
                        <span className="text-sm text-gray-700">Upload Banner</span>
                        )}
                    </label>
                    {!isEditMode &&  <button className="bg-slate-100  hover:bg-slate-300 text-white rounded-xl p-2 w-fit h-fit flex items-center justify-center"  onClick={() => removeImage(index)}>
                        <X size={18} className='text-black' />
                    </button>}
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

          {!isEditMode && <button
            onClick={addNewBanner}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Plus size={18} /> Add Another Banner
          </button>}

          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              onClick={() => handleUploadBanners()}
              className="bg-blue-500 w-full mb-10 text-white px-4 py-2 rounded-xl hover:bg-blue-600 hover:shadow-lg transition duration-300 ease-in-out"
            >
              {isEditMode ? "Update Banners" : "Upload Banners"}
            </button>
          </div>    
        </div>


        <div className='grid grid-cols-2 gap-2'>
            {bannerList.map((banner : any, index) => {
              return (
              <div key={banner._id} className="flex items-center gap-4 px-8 mb-10">
              <img
                src={banner.imageUrl}
                className="w-72 h-20 rounded-lg"
                alt='banner'
              />
              <input 
                  type="text"
                  placeholder="your uploaded link"
                  value={banner.link}
                  className="w-48 h-10 border px-3 rounded focus:outline-none focus:ring-0" />
              <button
                onClick={() => {editBanner(banner._id?.toString(), banner.imageUrl, banner.link); setIsEditMode(true)}}
                className='bg-blue-500 w-full text-white px-2 py-2 rounded-xl hover:bg-blue-600 hover:shadow-lg transition duration-300 ease-in-out hover:rotate-[1deg]'>
                Edit
              </button>
              <div className="p-2 bg-red-200 hover:bg-red-500 rounded-full cursor-pointer" 
                  onClick={(e) => {e.stopPropagation(); removeBanner(banner._id?.toString())}}
                  >
                  <X size={18} className='text-black cursor-pointer' />
              </div>
            </div>
              )
            })}
          </div>
        </div>
      </div>
  )

};

export default BannerCategory;
