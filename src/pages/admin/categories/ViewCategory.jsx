/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { IndexContext } from "../../../context";
import { axiosInstance } from "../../../lib/axiosInstanace";
import { FaTrash, FaFolder, FaFolderOpen, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { AdminContext } from "../../../context/admin-dashboard/Admin_Context";

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refetch, setRefetch } = useContext(IndexContext);
  const { setReFetchCategory, reFetchCategory } = useContext(AdminContext)



  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/category");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refetch]);

  const handleDeleteCategory = async (id) => {
    try {
      const res = await axiosInstance.delete(`/category/${id}`);
      if (res.data) {
        setCategories(categories.filter(category => category._id !== id));
        toast.success("Category deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleDeleteSubCategory = async (categoryId, subCategory) => {
    try {
      const res = await axiosInstance.put(`/category/delete-sub/${categoryId}/${subCategory}`);
      if (res.data) {
        setCategories(categories.map(category =>
          category._id === categoryId
            ? { ...category, sub: category.sub.filter(sub => sub !== subCategory) }
            : category
        ));
        toast.success("Sub-category deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting sub-category:", error);
      toast.error("Failed to delete sub-category");
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="text-4xl textColor animate-spin" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <FaFolder className="text-3xl text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Categories List</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your product categories</p>
          </div>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-blue-600 font-semibold">{categories.length}</span>
          <span className="text-gray-600 ml-2">Total Categories</span>
        </div>
      </div>

      <div className="space-y-4">
        {categories?.length > 0 ? (
          categories.map((category) => (
            <div 
              key={category._id} 
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div
                className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleCategory(category._id)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    {expandedCategories.includes(category._id) ? (
                      <FaFolderOpen className="text-blue-600 text-xl" />
                    ) : (
                      <FaFolder className="text-blue-600 text-xl" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{category.category}</h3>
                    <span className="text-sm text-gray-500">
                      {category.sub?.length || 0} subcategories
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <img 
                    src={category.image} 
                    alt={category.category}
                    className="w-12 h-12 rounded-lg object-cover border-2 border-gray-100"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category._id);
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              </div>

              {expandedCategories.includes(category._id) && (
                <div className="border-t border-gray-100 p-5 bg-gray-50">
                  <ul className="grid gap-3">
                    {category.sub?.length > 0 ? (
                      category.sub.map((subCategory, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            <span className="text-gray-700 font-medium">{subCategory}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteSubCategory(category._id, subCategory)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="text-center py-6 text-gray-500 bg-white rounded-lg border border-dashed border-gray-200">
                        <p>No subcategories available</p>
                        <p className="text-sm mt-1 text-gray-400">Click the add button to create one</p>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <FaFolder className="text-gray-300 text-5xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Categories Found</h3>
            <p className="text-gray-500">Add some categories to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCategory;
