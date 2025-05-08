import React, { useEffect, useState } from 'react';
import {X, Plus, Trash2 } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import axios from 'axios';

interface Category {
  id?: string;
  name: string;
  subcategories: string[];
}

const Category: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [newSubcategories, setNewSubcategories] = useState<string[]>(['']);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<boolean[]>([]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string[]>([]);

  const api = axios.create({
    baseURL: 'http://localhost:4000/api'
  });

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const validSubcategories = newSubcategories.filter(sub => sub.trim());
      if (validSubcategories.length === 0) {
        alert('Please add at least one subcategory.');
        return;
      }
      const subCategroiesWithImage = validSubcategories.map((subcategory, index) => {
        return {
          name: subcategory,
          image: uploadedFileUrl[index] || null
        };

      })

      const response = await api.post('/categories', {
        category: newCategory,
        subcategories: subCategroiesWithImage
      });
      if(response.status === 200){
        setNewCategory('');
        setNewSubcategories(['']);
        setUploadedFile([false]);
        setUploadedFileUrl([]);
        alert('Category added successfully');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category or category already exists');  
    }
  };

  useEffect(() => {
    allCategories();
    console.log("uploadedFile", uploadedFile);
  }, [newCategory, newSubcategories, uploadedFile]);

  const allCategories = async () => {
    try {
      const {data} = await api.get('/get-all-category');
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  const handleSubcategoryChange = (index: number, value: string) => {
    const updatedSubcategories = [...newSubcategories];
    updatedSubcategories[index] = value;
    setNewSubcategories(updatedSubcategories);
  };

  const addSubcategoryField = () => {
    setNewSubcategories([...newSubcategories, '']);
  };

  const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append('image', files[0]);
      const response : any = await api.post('/upload-image', formData, {
        headers: {
          'Content-Type' : 'multipart/form-data'
        }
      });
      console.log("response", response);
      if(response?.status === 200){
        alert('File uploaded successfully');
        console.log("File uploaded successfully:", response.data.data);
        setUploadedFile((prev) => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
      })
      setUploadedFileUrl((prev) => {
        const updated = [...prev];
        updated[index] = response.data.data;
        return updated;
      })
    }
      console.log("File uploaded successfully:", response.data);
    } else {
      console.log("No file selected");
    }
  }

  const removeIndexAndFile = (index: number) => {
    const updatedSubcategories = newSubcategories.filter((_, i) => i !== index);
    setNewSubcategories(updatedSubcategories);
    setUploadedFile((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;      
  })
  }

    const handleDeleteCategory = async (categoryId: string) => {
      if (window.confirm('Are you sure you want to delete this category?')) {
        try {
          console.log("categoryId", categoryId);
            const response = await api.delete(`/delete-category/${categoryId}`);
          if (response.status === 200){
            alert('Category deleted successfully');
            allCategories();
          }
        } catch (error) {
          console.error('Error deleting category:', error);
          alert('Failed to delete category');
        }
      }
    };

  return (
    <div className="flex h-screen bg-[#FFFFFF]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto bg-[#F0F2FD] p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Category Management</h1>

              {/* Add Category Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Category</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent focus:outline-none"
                  />
                  <div className="space-y-2">
                    {newSubcategories?.map((subcategory, index)=> (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={subcategory}

                          placeholder="Enter subcategory name"
                          onChange={(e) => handleSubcategoryChange(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent focus:outline-none"
                        />
                        <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={(e) => handleFileChange(index, e)}
                        id={`subcat-file-${index}`}
                        />
                        <label htmlFor={`subcat-file-${index}`}
                        className='flex p-x-2 items-center justify-center w-28 h-14 bg-slate-100 text-black rounded-lg cursor-pointer hover:bg-slate-200 hover:-translate-y-1 transition-all duration-300 ease-in-out'
                        >Upload Image</label>
                        {uploadedFile[index] &&  (
                          <span className='text-green-500 text-center'>Uploaded</span>
                        )}
                        {!uploadedFile[index] && (
                          <span className='text-red-500 text-center'>Not Uploaded</span>
                        )}
                        {/* Add a button to remove the subcategory field */}
                        {index === newSubcategories.length - 1 ? (
                          <button
                            onClick={addSubcategoryField}
                            className="p-2 text-[#6362E7] hover:bg-gray-100 rounded-lg focus:outline-none"
                          >
                            <Plus size={20} />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                                removeIndexAndFile(index)
                              }}
                            className="p-2 text-red-500 hover:bg-gray-100 rounded-lg focus:outline-none"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAddCategory}
                    className="w-full px-6 py-2 bg-[#6362E7] text-white rounded-lg hover:bg-[#5251c7] focus:outline-none focus:ring-2 focus:ring-[#6362E7] focus:ring-opacity-50"
                  >
                    Add Category
                  </button>
                </div>
              </div>

              {/* Categories List */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category; 