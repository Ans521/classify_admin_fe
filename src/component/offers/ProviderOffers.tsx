import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import { Plus, X } from 'lucide-react';
import axios from 'axios';
interface Banner {
  file: File | null;
  imageUrl: string | null;
  price: string;
  validity: string;
  link?: string;
  id : string | undefined
}

const ProviderOffers: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([
    { file: null, imageUrl: null, price: '', validity: '',id : undefined },
  ]);
  const [editOfferId, setEditOfferId] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [bannerList, setBannerList] = useState<any[]>([]);

  
  const api = axios.create({
    baseURL: 'http://localhost:4000/api',
  });

  useEffect(() => {
    getBanners();
  }, [banners]);

  useEffect(() => {
    console.log("bannerList", bannerList);
    console.log("banners", banners);
  }, [banners, bannerList]);

  const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const newBanners = [...banners];
    newBanners[index].file = file;

    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      const { data }: any = await api.post('/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      newBanners[index].imageUrl = data.data || null;
      setBanners(newBanners);
    }
  };

  const handleFieldChange = (index: number, field: string, value: string) => {
    const updated = [...banners];
    (updated[index] as any)[field] = value;
    setBanners(updated);
  };
 
  const addNewBanner = () => {
    setBanners([...banners, { file: null, imageUrl: null, price: '', validity: '', link: '', id : undefined }]);
  };
 
  const removeImage = (idx: number) => {
    setBanners(banners.filter((_, index) => index !== idx));
  };

  const handleUploadBanners = async () => {
    try {
      const payload = banners.map((b: any) => ({
        imageUrl: b.imageUrl,
        price: b.price,
        validity: b.validity,
      }));
      let updatePayload;

      if(isEditMode){
        updatePayload = payload[0];
      }
      console.log("editOfferId", editOfferId);
      const response : any = isEditMode
        ? await api.patch('/update-offer', { data: updatePayload }, {params  : {id : editOfferId}})
        : await api.post('/add-offer', { data: payload });

      if (response.status === 200) {
        alert(`Banner ${isEditMode ? 'updated' : 'added'} successfully`);
        setIsEditMode(false);
        // setBanners([{ file: null, imageUrl: null, price: '', validity: '', link: ''}]);
        getBanners();
      }

    } catch (error) {
      console.error(error);
    }
  };

  const getBanners = async () => {
    try {
      const res : any = await api.get('/get-all-offer');
      if (res.status === 200) setBannerList(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const editBanner = (banner: any) => {
    setEditOfferId(banner._id);
    setBanners([
      {
        file: null,
        imageUrl: banner.imageUrl,
        price: banner.price,
        validity: banner.validity,
        id : banner._id
      },
    ]);
    setIsEditMode(true);
  };

  const removeBanner = async (id: string) => {
    try {
      const res: any = await api.delete('/delete-offer', { params: { id } });
      if (res.status === 200) {
        alert('Banner deleted');
        setIsEditMode(false);
        setBannerList((prev) => prev.filter((banner) => banner._id !== id))
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#FFFFFF]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <div className="p-10 space-y-8">
          {banners.map((banner, index) => (
            <div key={index} className="flex flex-col gap-4">
              {/* Image Upload */}
              <div className="flex gap-4 items-center">
                <label htmlFor={`upload-${index}`} className="cursor-pointer border p-4 rounded">
                  {banner.imageUrl ? (
                    <img src={banner.imageUrl} alt="preview" className="w-full h-full object-contain rounded" />
                  ) : (
                    <span>Upload Banner</span>
                  )}
                </label>
                {!isEditMode && (
                  <button onClick={() => removeImage(index)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                    <X className="text-black" />
                  </button>
                )}
              </div>

              <input
                type="file"
                id={`upload-${index}`}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(index, e)}
              />

              <input
                type="Number"
                placeholder="Price (₹)"
                value={banner.price}
                onChange={(e) => handleFieldChange(index, 'price', e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <input
                type="Number"
                placeholder="Valid for (days)"
                value={banner.validity}
                onChange={(e) => handleFieldChange(index, 'validity', e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Optional: Redirect link"
                value={banner.link}
                onChange={(e) => handleFieldChange(index, 'link', e.target.value)}
                className="border px-3 py-2 rounded"
              />
            </div>
          ))}

          {!isEditMode && (
            <button
              onClick={addNewBanner}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <Plus size={18} /> Add Banner
            </button>
          )}

          <button
            onClick={() => handleUploadBanners()}
            className="bg-blue-600 text-white w-full py-2 mt-6 rounded-xl hover:bg-blue-700"
          >
            {isEditMode ? 'Update Banner' : 'Upload Banner'}
          </button>
        </div>

        {/* Banner List */}
        <div className="grid grid-cols-2 gap-6 p-6">
          {bannerList.map((banner: any) => (
            <div key={banner._id} className="border p-4 rounded-lg shadow-sm space-y-4 bg-white">
              <img src={banner.imageUrl} alt="banner" className="w-full h-80 object-contain rounded" />
              <div>Price: ₹{banner.price}</div>
              <div>Valid for: {banner.validity} month(s)</div>
              {banner.link && <div className="text-blue-500">Link: {banner.link}</div>}

              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => editBanner(banner)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeBanner(banner._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderOffers;
