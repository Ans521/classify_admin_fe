import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import axios from 'axios';


// uploadfile toh category kii image ke liye hai, agr ye true hai toh uploaded green dikhega and also we can see the image from accessing the index from uploadfileurl
// image mei image ka url hai jo humne upload kiya hai usse pdne ke liye hai from createurl object
// uploadfileurl wo link hai jo upload krke mujhe mila hai then usse map kiya so that we i add the new category then i can send it with the specific subcategory

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
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [openedUrl, setOpenedUrl] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [catId, setCatId] = useState<string | null>(null);
  const [subCatId, setSubCatId] = useState<string[]>([]);

  const api = axios.create({
    baseURL: 'http://13.202.163.238:4000/api'
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
      console.log("validSubcategories", validSubcategories);
      console.log("subCatId", subCatId);
      console.log(isEditMode, "isEditMode");
      console.log("uploadedFileUrl", uploadedFileUrl);

      if(!isEditMode){
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
        setUploadedFile([]);
        setUploadedFileUrl([]);
        setIsEditMode(false);
        alert('Category added successfully');
      }
    }else{
        const updateSubcateWithImage = validSubcategories.map((subcategory, index) => {
        return {
          subcategoryId: subCatId[index],
          name: subcategory,
          image: uploadedFileUrl[index] || null
        };
      })
        const response = await api.post('/update-category', {
        category: newCategory,
        categoryId: catId,
        subcategories: updateSubcateWithImage
      });

      if (response.status === 200) {
        setNewCategory('');
        setNewSubcategories(['']);
        setUploadedFile([]);
        setUploadedFileUrl([]);
        setIsEditMode(false);
        alert('Category updated successfully');
      }
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
  }, [uploadedFileUrl, newSubcategories,newCategory, uploadedFile, checkedItems, iconFileUrl]);

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
          setImageUrl((prev) => {
            const imagePreview = URL.createObjectURL(files[0]);
            const updated = [...prev];
            updated[index] = imagePreview;
            return updated;
          })
        } else {
          console.log("subcategory in handle file change", subcategory);
          setIconFileUrl((prev) => {
            const updated : any = [...prev];
            const subcatId = subcategory._id.toString();
            const findIndex = updated.findIndex((item : any) => Object.keys(item)[0] === subcatId);
            if (findIndex !== -1) {
              updated[findIndex][subcategory._id.toString()] = response.data.data;
            }else{
              updated.push({[subcategory._id.toString()] : response.data.data});
            }
            return updated;
          })
        }
      }
    } else {
      console.log("No file selected");
    }
  }
useEffect(() => {
  console.log("Updated iconFileUrl:", iconFileUrl);
}, [iconFileUrl]);
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
  }, [imageUrl]);

  useEffect(() => {
    console.log("checkedItems", checkedItems);
  }, [checkedItems]);

  const handleGetSpecialCategory = async () => {
    try {
      const { data } = await api.get('/get-special-subcat');
      if(!data) return
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


  const handleImageClick = (url : any) => {
      setIsOpen(prev  => !prev)

      console.log("url", url)
      setOpenedUrl(url)
  }
  


  const handleEditCategory = async (categoryId : string) => {
    try {
        console.log("categoryId", categoryId);
        const category : any = categories.find((cat : any) => cat._id === categoryId);
        setNewCategory(category?.category);
        setCatId(categoryId);

        setNewSubcategories(category?.subcategories.map((subcat : any) => subcat.name));
        setSubCatId(category?.subcategories.map((subcat : any) => subcat._id));

        setUploadedFile((prev) => {
            const updated = [...prev];
            category?.subcategories.forEach((subcat : any, index : number) => {
            console.log("index", index);
            updated[index] = true;
          })
          return updated;
        })
        setImageUrl((prev) => {
          const updated = [...prev];
          category?.subcategories.forEach((subcat : any, index : number) => {
            updated[index] = subcat.image;
          })
          return updated;
        })
        setUploadedFileUrl((prev) => {
          const updated = [...prev];  
          category?.subcategories.forEach((subcat : any, index : number) => {
            updated[index] = subcat.image;
          })
          return updated;
        })
        
    } catch (error) {
        alert('Failed to edit category');
    }
  }

  const handleUnChecked = async (index : number, subcatId : string) => {
    try{
      console.log("subcatId", subcatId);
      setCheckedItems((prev) => {
          const checkedOne : any = [...prev];

          const isChecked = checkedOne.findIndex((item : any) => Object.keys(item)[0] === subcatId)
          if(isChecked > -1){
            checkedOne.splice(isChecked, 1);
          }
          return checkedOne;
      })

      const response : any = await api.put('/update-icon-special-subcat', {
        subcategoryId: subcatId,
        specialCategory: false
      })

      console.log("response", response);
      if (response.status === 200) {
        alert('Special Subcategory removed successfully');
      }else{
        alert('Failed to remove special subcategory');
      }
    }catch (error) {
      alert('Failed to remove special subcategory');
      console.error('Error unchecking item:', error);
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
                <h2 className="text-lg font-semibold text-gray-700 mb-4">{newCategory ? 'Edit Category' : 'Add New Category'}</h2>
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
                        >{isEditMode ? "Edit Image" : "Upload Image"}</label>
                        {uploadedFile[index] && (
                          <>
                           <span className='text-green-500 text-center'>Uploaded</span>
                           <img src={imageUrl[index]} alt='' className='w-32 h-20 rounded-lg' onClick={() => handleImageClick(imageUrl[index])}/>
                          </>
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
                            {isEditMode ?  '': <X size={20} />}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAddCategory}
                    className="w-full px-6 py-2 bg-[#6362E7] text-white rounded-lg hover:bg-[#5251c7] focus:outline-none focus:ring-2 focus:ring-[#6362E7] focus:ring-opacity-50"
                  >
                    {isEditMode ? "Update Category" : "Add Category"}
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
                        <div className='flex'>
                        <button
                          onClick={() => handleDeleteCategory(category?._id?.toString())}  
                          className="flex items-center space-x-1 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg focus:outline-none transition-colors"
                          title="Delete category"
                        >
                          <Trash2 size={16} />
                          <span className="text-sm">Delete Category</span>
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                        onClick={() =>{ handleEditCategory(category?._id?.toString())
                        setIsEditMode(true)
                         }}>
                          Edit
                        </button>
                        </div>

                      </div>
                      <div className="space-y-2">
                        {category?.subcategories?.map((subcategory: any, index: any) => (
                          <div key={index} className="flex  justify-between space-x-3 items-center pl-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-gray-600">{index + 1}.</span>
                              <span className="text-gray-600">{subcategory.name}</span>
                              <img src={subcategory.image} alt='' className='w-12 h-8 rounded-lg' onClick={() => handleImageClick(subcategory.image)}/>
                            </div>
                            <button
                            className="flex items-center space-x-1 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg focus:outline-none transition-colors"
                            title="Delete category"
                            onClick={() => handleDeleteCategory(subcategory._id?.toString())}
                          >
                            <X size={16} />
                          </button>
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
                {categories?.flatMap((category: any, idx: any) => category.subcategories || []).map((subcategory: any, idx: number) => {
                const matchedIcon : any = iconFileUrl.find((item: any) => Object.keys(item)[0] === subcategory._id.toString());
                return (
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

                      {matchedIcon && matchedIcon[subcategory._id.toString()] &&
                      <>
                        <h1 className="bg-green-50 inline-flex items-center text-green-600 text-lg font-medium mr-2 px-2.5 py-0.5 rounded h-10 w-24">Uploaded</h1>
                        <img src={matchedIcon[subcategory._id.toString()]} className='w-16 h-10 rounded-lg mr-2 object-cover object-center border border-gray-500 cursor-pointer'
                        onClick={() => handleImageClick(matchedIcon[subcategory?._id.toString()] ?? '')}
                        alt=''/> 
                        <button className='bg-transparent rounded-lg p-1 hover:bg-red-100 transition-all duration-300 ease-in-out ml-2' onClick={() => handleUnChecked(idx, subcategory?._id.toString())}>
                          <X size={20} className='text-red-500'/>
                        </button>
                      </>
                      }
                    </div>
                    )}
                    {isOpen && openedUrl && (
                      <div className="fixed inset-0 flex items-center justify-center">
                        <div className="fixed inset-0 bg-black opacity-10" onClick={() => setIsOpen(false)}></div>
                          <div className="absolute w-1/2 h-96 bg-white rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                            <img src={openedUrl} className="w-full h-full object-contain p-4 z-20" alt=''/>
                            <button
                              className="absolute bg-red-400 rounded-full p-1 -top-2 -right-2 hover:bg-red-600"
                              onClick={() => setIsOpen(false)}
                            >
                              <X size={20} />
                            </button>
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
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

