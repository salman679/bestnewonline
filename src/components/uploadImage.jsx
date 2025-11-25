import { IKContext, IKUpload } from 'imagekitio-react';
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from '../lib/axiosInstanace';
import { FiUpload } from 'react-icons/fi';

const authenticator = async () => {
  try {
    const response = await axiosInstance.get(`/auth/upload-auth`);
    const { signature, expire, token } = response.data;
    return { signature, expire, token };
  } catch (error) {
    console.error("Error in authenticator:", error);
    throw new Error(`Authentication request failed: ${error.response?.data?.message || error.message}`);
  }
};

const UploadImage = ({
  setProgress,
  setCoverProgress,
  setData,
  children,
  onUploadStart,
  onUploadEnd,
  maxFileSize = 15, // in MB
  className = '',
  buttonClassName = '',
  showProgress = true,
  multiple = false,
  folder = 'products'
}) => {
  const ref = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      throw new Error(`File size should be less than ${maxFileSize}MB`);
    }


    return true;
  };

  const onError = (error) => {
    setIsUploading(false);
    setUploadError(error.message);
    toast.error(error.message || "Image Upload Failed!");
    console.error("Upload error:", error);
  };

  const onSuccess = (res) => {
    setIsUploading(false);
    setUploadError(null);
    setData(res.url);
    toast.success("Image Uploaded Successfully!");
    if (setProgress) {
      setTimeout(() => setProgress(0), 1000);
    }
    onUploadEnd?.();
  };

  const onUploadProgress = (progress) => {
    const percentage = Math.round((progress.loaded / progress.total) * 100);
    setProgress && setProgress(percentage);
    setCoverProgress && setCoverProgress(percentage);
  };

  const onUploadStartHandler = () => {
    setIsUploading(true);
    setUploadError(null);
    onUploadStart?.();
  };

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isUploading) {

      ref.current.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <IKContext
        publicKey={import.meta.env.VITE_PUBLIC_KEY}
        urlEndpoint={import.meta.env.VITE_URLENDPOINT}
        authenticator={authenticator}
      >
        <IKUpload
          useUniqueFileName
          onError={onError}
          onSuccess={onSuccess}
          onUploadProgress={onUploadProgress}
          onUploadStart={onUploadStartHandler}
          className="hidden"
          ref={ref}
          multiple={multiple}
          folder={folder}
          validateFile={validateFile}
        />

        <button
          className={`cursor-pointer relative ${buttonClassName} ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleClick}
          disabled={isUploading}
        >
          {children || (
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FiUpload className="w-5 h-5" />
              <span>Upload Image</span>
            </div>
          )}
        </button>

        {showProgress && isUploading && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bgColor transition-all duration-300"
              style={{ width: `${setProgress || 0}%` }}
            />
          </div>
        )}

        {uploadError && (
          <div className="absolute -bottom-6 left-0 text-xs textColor">
            {uploadError}
          </div>
        )}
      </IKContext>
    </div>
  );
};

export default UploadImage;
