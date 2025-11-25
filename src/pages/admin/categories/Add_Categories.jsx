/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../../context/admin-dashboard/Admin_Context";
import { axiosInstance } from "../../../lib/axiosInstanace";
import ViewCategory from "./ViewCategory";
import { FaPlus, FaList, FaTrash } from "react-icons/fa";
import UploadImage from '../../../components/uploadImage';
import { toast } from "react-hot-toast";
import { IndexContext } from "../../../context";

const AddCategories = () => {
  const [fetchCategories, setFetchCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const { setReFetchCategory, reFetchCategory } = useContext(AdminContext)
  const { refetch, setRefetch } = useContext(IndexContext);


  const updatedSubCategories = fetchCategories.find(c => c.category === category);
  const categoryId = updatedSubCategories?._id;

  // 🔹 সাব-ক্যাটাগরি যোগ করার ফাংশন
  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    if (!category || !subCategory) return;
    try {
      const res = await axiosInstance.put(`/category/${categoryId}`, { sub: subCategory });
      if (res) {
        setReFetchCategory(!reFetchCategory);
        setRefetch(!refetch)
      }
    } catch (error) {
      console.error("Error adding sub-category:", error);
    }

    setSubCategory(""); // Clear sub-category input
  };

  // 🔹 নতুন ক্যাটাগরি যোগ করার ফাংশন
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const res = await axiosInstance.post("/category", {
        category: newCategory,
        image: categoryImage
      });

      if (res) {
        setReFetchCategory(!reFetchCategory);
        setRefetch(!refetch);
        toast.success("Category added successfully!");
        setNewCategory("");
        setCategoryImage("");
        setPreviewImage("");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  };

  const handleImageDelete = () => {
    setCategoryImage("");
    setPreviewImage("");
  };

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await axiosInstance.get("/category");
        setFetchCategories(res.data);
        setReFetchCategory(!reFetchCategory);
      } catch (error) {
        console.error("Error fetching sub-categories:", error);
      }
    };

    fetchSubCategories();
  }, [handleAddCategory]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <FaList className="text-3xl textColor mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Manage Categories</h2>
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="mb-8">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FaPlus className="textColor mr-2" />
              Add New Category
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all"
                  type="text"
                  name="category"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category Image
                </label>
                <div className="grid grid-cols-1 gap-4">
                  <UploadImage
                    setData={(url) => {
                      setCategoryImage(url);
                      setPreviewImage(url);
                    }}
                    maxFileSize={2}
                    allowedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                    className="w-full"
                    showProgress={true}
                    multiple={false}
                    folder="categories"
                    onUploadEnd={() => toast.success("Image upload completed!")}
                  />
                </div>

                {/* Image Preview */}
                {previewImage && (
                  <div className="relative group mt-2">
                    <img
                      src={previewImage}
                      alt="Category preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleImageDelete}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                )}
              </div>

              <button
                className="w-full bgColor hover:bg-teal-600 text-white px-6 py-3 rounded-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                type="submit"
              >
                <FaPlus />
                Add Category
              </button>
            </div>
          </div>
        </form>

        {/* Add Sub-Category Form
        <form onSubmit={handleAddSubCategory}>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FaPlus className="textColor mr-2" />
              Add Sub-Category
            </h3>
            <div className="space-y-4">
              <select
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {fetchCategories?.map((category) => (
                  <option key={category._id} value={category?.category}>
                    {category?.category}
                  </option>
                ))}
              </select>

              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all"
                type="text"
                placeholder="Enter sub-category name"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              />

              <button
                className="w-full bgColor hover:bg-teal-600 text-white px-6 py-3 rounded-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FaPlus />
                Add Sub-Category
              </button>
            </div>
          </div>
        </form> */}
      </div>
      <ViewCategory />
    </div>
  );
};

export default AddCategories;
