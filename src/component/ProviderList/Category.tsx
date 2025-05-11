import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import axios from 'axios';
import { kMaxLength } from 'buffer';
import { PiAlignCenterVerticalSimpleLight } from 'react-icons/pi';
import { sep } from 'path';

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
  const [iconFileUrl, setIconFileUrl] = useState<{ [key: string]: boolean }[]>([]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }[]>([]);

  const api = axios.create({
    baseURL: 'http://localhost:4000/api'
  });

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert("fill category")
      return;
    }

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
      if (response.status === 200) {
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
  const handleAddIconImage = async() => {
    try {

      const mapIconFileUrl = iconFileUrl.map((item : any) => {
        return {
          iconImage: Object.values(item)[0], 
          subcategoryId: Object.keys(item)[0],
          specialCategory: true
        }
      })

      const response = await api.post('/add-special-subcat', {data : mapIconFileUrl});
      console.log("response", response);
      if (response.status === 200) {
        alert('Icon image added successfully');
      }
    } catch (error) {
      console.error('Error adding icon image:', error);
      alert('Failed to add icon image');
    }
  }
  useEffect(() => {
    allCategories();
    console.log("iconFileUrl", iconFileUrl);
    console.log("categories", categories);
  }, [uploadedFileUrl, newSubcategories, uploadedFile, checkedItems, iconFileUrl]);

  const allCategories = async () => {
    try {
      const { data } = await api.get('/get-all-category');
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

  const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>, subcategory?: any) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append('image', files[0]);
      const response: any = await api.post('/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response?.status === 200) {
        alert('File uploaded successfully');
        console.log("File uploaded successfully:", response.data.data);
        setUploadedFile((prev) => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        })
        if (!subcategory) {
          console.log("subcatennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnngory");
          setUploadedFileUrl((prev) => {
            const updated = [...prev];
            updated[index] = response.data.data;
            return updated;
          })
        } else {
          console.log("subca9899999999999999999999999tegory78");
          setIconFileUrl((prev) => {
            const updated : any = [...prev];

            const subcatId = subcategory._id.toString();
            console.log("updated", updated);
            console.log("subcategory._id.toString()", subcategory._id.toString());
            const findIndex = updated.findIndex((item : any) => Object.keys(item)[0] === subcatId);
            console.log("findIndex", findIndex);
            if (findIndex !== -1) {
              updated[findIndex][subcategory._id.toString()] = response.data.data;
            }else{
              updated.push({[subcategory._id.toString()] : response.data.data});
            }
            return updated;
          })
          console.log("File uploaded successfully:", response.data);
        }
      }
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
    setUploadedFileUrl((prev) => {
      const updated : any = [...prev];
      updated[index] = undefined;
      return updated;
    })
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        console.log("categoryId", categoryId);
        const response = await api.delete(`/delete-category/${categoryId}`);
        if (response.status === 200) {
          alert('Category deleted successfully');
          allCategories();
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    }
  };

  const handleChecked = (idx : number, subcatId : string) => {
      // Check if the subcategory ID is already in the checkedItems array 
      console.log("subcatId", subcatId);
      // Object.keys(checkedOne[idx]) mei [0] take out the subcat from the array as it  return the array
    
      // on very find iteration the item will contain each object of the array
      // so we are checking if the subcatId is already present in the array or not
      // if it is present then we are removing it from the array
      // if it is not present then we are adding it to the array
      setCheckedItems((prev) => { 
        const checkedOne : any = [...prev]; 
        // objecy.keys(checkedOne[idx]) will return the array of keys of the object like ["subcatId"] that why 0 is used 
        const isChecked = checkedOne.findIndex((item : any) => Object.keys(item)[0] === subcatId)
        if(isChecked > -1){
          // array.splice(startIndex, deleteCount)
          // startIndex is the index from where we want to delete the item
          // deleteCount is the number of items we want to delete from the array
          checkedOne.splice(isChecked, 1);
        }else{
          checkedOne.push({[subcatId] : true})
        }
        return checkedOne;
      })
  }
  useEffect(() => {
    handleGetSpecialCategory();
  }, [])

  const handleGetSpecialCategory = async () => {
    try {
      const { data } = await api.get('/get-special-subcat');
      console.log("special category", data);
      setCheckedItems((prev : any) => {
        const checkedOne : any = [];
        data.data.forEach((item : any) => {
          checkedOne.push({[item._id] : true})
        })
        return checkedOne
      });
      setIconFileUrl((prev : any) => {
        const checkedOne : any = [];
        data.data.forEach((item : any) => {
          checkedOne.push({[item._id] : item.iconImage})
        })
        return checkedOne
      }
      )
    }catch (error) {
      console.error('Error fetching special category:', error);
    }
  }  

 
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
                    {newSubcategories?.map((subcategory, index) => (
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
                        {uploadedFile[index] && (
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
            <div className='flex flex-col mb-8 mt-8 bg-white rounded-xl shadow-lg p-3'>
              <h1 className='text-2xl text-center font-bold text-gray-800 mb-6'>All Categories</h1>
              <div>
                <div className="space-y-4">
                  {categories && categories?.map((category: any) => (
                    <div key={category?.id} className="border border-gray-100 rounded-lg shadow-sm p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-2xl font-medium ml-2 text-gray-800">Category : {category?.category}</h3>
                        <button
                          onClick={() => handleDeleteCategory(category?._id?.toString())}  
                          className="flex items-center space-x-1 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg focus:outline-none transition-colors"
                          title="Delete category"
                        >
                          <Trash2 size={16} />
                          <span className="text-sm">Delete Category</span>
                        </button>
                      </div>
                      <div className="space-y-2">
                        {category?.subcategories?.map((subcategory: any, index: any) => (
                          <div key={index} className="flex  justify-between space-x-3 items-center pl-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-gray-600">{index + 1}.</span>
                              <span className="text-gray-600">{subcategory.name}</span>
                            </div>
                            {/* <button
                            className="flex items-center space-x-1 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg focus:outline-none transition-colors"
                            title="Delete category"
                          >
                            <X size={16} />
                          </button> */}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
            <div className="bg-gray-600 text-white mt-4 p-4 border border-gray-700 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-white mb-4">All Subcategories (Unified List)</h2>
              <ul className="space-y-2">
                {categories?.flatMap((category: any, idx: any) => category.subcategories || []).map((subcategory: any, idx: number) => (
                  <li key={subcategory._id || idx} className="flex items-center justify-between space-x-3 p-3">
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="form-checkbox text-blue-500 mr-3 w-6 h-6 bg-gray-700 border-gray-500"
                        checked={!!checkedItems.find((item : any) => Object.keys(item)[0] === subcategory._id.toString())}
                        onChange={() => handleChecked(idx, subcategory._id.toString())}
                      />
                      <span className="text-white text-lg">{subcategory.name}</span>
                    </div>
                   {!!checkedItems.find((item : any) => Object.keys(item)[0] === subcategory._id.toString()) && (
                      <div className='flex'>
                        <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={(e) => handleFileChange(idx, e, subcategory)}
                        id={`subcat-file-${subcategory._id}`}
                      />
                     <label htmlFor={`subcat-file-${subcategory._id}`} 
                       className='flex text-bold items-center justify-center w-24 h-10 bg-slate-100 text-black rounded-lg cursor-pointer hover:bg-slate-200 hover:-translate-y-1 transition-all duration-300 ease-in-out mr-2'
                       >Upload Icon</label>

                      {!!iconFileUrl.find((item : any) => Object.keys(item)[0] === subcategory._id.toString()) && <h1 className="bg-green-50 inline-flex items-center text-green-600 text-lg font-medium mr-2 px-2.5 py-0.5 rounded">Uploaded</h1>}
                    </div>
                    )}
                  </li>
                ))}
              </ul>
              <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" onClick={handleAddIconImage}>
                Save Changes
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;

