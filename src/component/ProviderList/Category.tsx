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

  console.log("categories", typeof(categories));

  const api = axios.create({
    baseURL: 'http://13.202.163.238:4000/api'
  });

console.log("categories", categories);
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const validSubcategories = newSubcategories.filter(sub => sub.trim());
      const response = await api.post('/categories', {
        category: newCategory,
        subcategories: validSubcategories
      });


      if(response.status === 200){
        setNewCategory('');
        setNewSubcategories(['']);
        alert('Category added successfully');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');  
    }
  };

  useEffect(() => {
    allCategories();
  }, [newCategory, newSubcategories]);

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

  const removeSubcategoryField = ( index: number) => {
    const updatedSubcategories = newSubcategories.filter((_, i) => i !== index);
    setNewSubcategories(updatedSubcategories);
  };

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
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={subcategory}
                          onChange={(e) => handleSubcategoryChange(index, e.target.value)}
                          placeholder="Enter subcategory name"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent focus:outline-none"
                        />
                        {index === newSubcategories.length - 1 ? (
                          <button
                            onClick={addSubcategoryField}
                            className="p-2 text-[#6362E7] hover:bg-gray-100 rounded-lg focus:outline-none"
                          >
                            <Plus size={20} />
                          </button>
                        ) : (
                          <button
                            onClick={() => removeSubcategoryField(index)}
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
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Categories</h2>
                <div className="space-y-4">
                  {categories && categories?.map((category: any) => (
                    <div key={category?.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-2xl font-medium ml-2 text-gray-800">Category : {category?.category}</h3>
                          <button
                            onClick={() => handleDeleteCategory(category?._id.toString())}
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
                              <span className="text-gray-600">{subcategory}</span>
                            </div>
                            {/* <button
                            onClick={() => handleDeleteCategory(category?.id)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category; 