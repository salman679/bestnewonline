import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaImage, FaTimes } from 'react-icons/fa';
import UploadImage from '../../../components/uploadImage';
import { axiosInstance } from '../../../lib/axiosInstanace';
import Swal from 'sweetalert2'
const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    color: 'bg-blue-500',
    isActive: true
  });

  const colorOptions = [
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-orange-500', label: 'Orange' },
    { value: 'bgColor', label: 'Teal' }
  ];

  // Fetch banners
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axiosInstance.get('/banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    try {
      const formDataToSend = new FormData();

      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          // If it's an image URL (from previous upload), send it as is
          if (typeof formData[key] === 'string') {
            formDataToSend.append(key, formData[key]);
          } else {
            // If it's a File object, append it directly
            formDataToSend.append(key, formData[key]);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingBanner) {
        await axiosInstance.patch(`/banners/${editingBanner._id}`, formData);
        toast.success('Banner updated successfully');
      } else {
        await axiosInstance.post('/banners', formData);
        toast.success('Banner added successfully');
      }

      fetchBanners();
      resetForm();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error('Failed to save banner');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      image: banner.image,
      title: banner?.title || ' ',
      subtitle: banner?.subtitle || ' ',
      description: banner?.description || ' ',
      buttonText: banner?.buttonText || ' ',
      buttonLink: banner?.buttonLink || ' ',
      color: banner?.color || ' ',
      isActive: banner?.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (bannerId) => {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/banners/${bannerId}`);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
          fetchBanners();
        } catch (error) {
          console.error('Error deleting banner:', error);
          toast.error('Failed to delete banner');
        }
      }
    });

  };

  const handleToggleStatus = async (bannerId, currentStatus) => {
    try {
      await axiosInstance.patch(`/banners/${bannerId}/toggle`);
      toast.success(`Banner ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchBanners();
    } catch (error) {
      console.error('Error toggling banner status:', error);
      toast.error('Failed to update banner status');
    }
  };

  const resetForm = () => {
    setFormData({
      image: '',
      title: '',
      subtitle: '',
      description: '',
      buttonText: '',
      buttonLink: '',
      color: 'bg-blue-500',
      isActive: true
    });
    setEditingBanner(null);
    setShowForm(false);
  };

  const handleImageUpload = (file) => {
    setFormData(prev => ({ ...prev, image: file }));
  };

  return (
    <div className="p-6 max-[640px]:p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl max-[640px]:text-xl font-bold text-gray-900 dark:text-white">
          Banner Management
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 max-[640px]:text-sm transition-colors"
        >
          <FaPlus />
          {showForm ? 'Cancel' : 'Add New Banner'}
        </button>
      </div>

      {/* Banner Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-[640px]:p-3"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Banner Image
                </label>
                <UploadImage
                  setData={handleImageUpload}
                  maxFileSize={2}
                  allowedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                  className="w-full"
                  showProgress={true}
                  multiple={false}
                  folder="banners"
                  onUploadEnd={() => toast.success("Image uploaded successfully!")}
                />
                {formData.image && (
                  <div className="mt-4">
                    <img
                      src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"

                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"

                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows="3"

                />
              </div>

              {/* Button Text & Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"

                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"

                  />
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Button Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                      className={`w-8 h-8 rounded-full ${color.value} ${formData.color === color.value ? 'ring-2 ring-offset-2 ring-orange-500' : ''
                        }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 textColor focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Active
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingBanner ? 'Update Banner' : 'Add Banner'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map(banner => (
          <motion.div
            key={banner._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${banner.isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                  }`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {banner.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {banner.description}
              </p>
              <div className="flex justify-between items-center">

                <button
                  onClick={() => handleEdit(banner)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(banner._id)}
                  className="p-2 textColor hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash />
                </button>

              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BannerManagement; 