import  { useState, useEffect } from 'react';
import { axiosInstance } from '../../../lib/axiosInstance';
import { toast } from 'react-hot-toast';
import { FaSave, FaSpinner } from 'react-icons/fa';
import UploadImage from '../../../components/uploadImage';

const Settings = () => {
  const [settings, setSettings] = useState({
    headerLogo: '',
    footerLogo: '',
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    width: '',
    height: '',
    deliveryCharge: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: '',
      whatsAppLink: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance('/settings');
      setSettings(response.data);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };
const handleChange = e => {
  const { name, value } = e.target;

  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...(prev?.[parent] || {}), // এখানে fallback যোগ করা হলো
        [child]: value,
      },
    }));
  } else {
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axiosInstance.put('/settings', settings);

      console.log(res);
      
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-[640px]:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Website Settings</h1>
            <p className="text-gray-500 mt-1">Manage your website configuration and preferences</p>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <FaSave />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>

        <div className="grid gap-6">
          {/* Logo Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">Logo Settings</h2>
              <p className="text-sm text-gray-500 mt-1">Upload and manage your website logos</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Header Logo</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <UploadImage
                      setData={(url) => setSettings(prev => ({ ...prev, headerLogo: url }))}
                      maxFileSize={2}
                      allowedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                      multiple={false}
                      folder="logos"
                      className="w-full"
                    />
                    {settings?.headerLogo && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={settings?.headerLogo}
                          alt="Header Logo"
                          className="max-h-28 object-contain mx-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Footer Logo</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <UploadImage
                      setData={(url) => setSettings(prev => ({ ...prev, footerLogo: url }))}
                      maxFileSize={2}
                      allowedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                      multiple={false}
                      folder="logos"
                      className="w-full"
                    />
                    {settings?.footerLogo && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={settings?.footerLogo}
                          alt="Footer Logo"
                          className="max-h-28 object-contain mx-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* General Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">General Settings</h2>
              <p className="text-sm text-gray-500 mt-1">Basic information about your website</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Site Name</label>
                  <input
                    type="text"
                    name="siteName"
                    value={settings?.siteName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter site name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Site Description</label>
                  <textarea
                    name="siteDescription"
                    value={settings?.siteDescription}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    rows="3"
                    placeholder="Enter site description"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
              <p className="text-sm text-gray-500 mt-1">How customers can reach you</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={settings?.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="contact@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={settings?.contactPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="+1 (234) 567-8900"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    value={settings?.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    rows="3"
                    placeholder="Enter your business address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Settings */}
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">Delivery Settings</h2>
              <p className="text-sm text-gray-500 mt-1">Configure delivery-related settings</p>
            </div>
            <div className="p-6">
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700">Delivery Charge</label>
                <div className="mt-2 relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="deliveryCharge"
                    value={settings?.deliveryCharge}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div> */}

         

          {/* Social Media Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">Social Media</h2>
              <p className="text-sm text-gray-500 mt-1">Connect your social media accounts</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Facebook</label>
                  <input
                    type="url"
                    name="socialMedia.facebook"
                    value={settings?.socialMedia?.facebook}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Twitter</label>
                  <input
                    type="url"
                    name="socialMedia.twitter"
                    value={settings?.socialMedia?.twitter}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Instagram</label>
                  <input
                    type="url"
                    name="socialMedia.instagram"
                    value={settings?.socialMedia?.instagram}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">YouTube</label>
                  <input
                    type="url"
                    name="socialMedia.youtube"
                    value={settings?.socialMedia?.youtube}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="https://youtube.com/yourchannel"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                  <input
                    type="text"
                    name="socialMedia.whatsAppLink"
                    value={settings?.socialMedia?.whatsAppLink}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter WhatsApp link or number"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;