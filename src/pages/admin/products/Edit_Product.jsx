import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../lib/axiosInstanace";
import { useNavigate, useParams } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import { FaPlus, FaTrash, FaSave, FaArrowLeft } from 'react-icons/fa';
import UploadImage from '../../../components/uploadImage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styles.css';

export default function EditProduct() {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const initialProductState = {
    name: "",
    description: "",
    price: "",
    category: "",
    image: [],
    quantity: "",
    brand: "",
    sku: "",
    discount: "",
    sold: "",
    supplier: "",
    warranty: "",
    returnPolicy: "",
    shippingCost: "",
    variants: [{ size: "", color: "", additionalPrice: "" }],
    specifications: [{ feature: "", value: "" }],
    additionalInfo: [""],
  };

  const [product, setProduct] = useState(initialProductState);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'link', 'image', 'video'
  ];

  // Fetch product data
  const fetchProduct = useCallback(async () => {
    if (!params.id) return;

    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(`/products/id/${params.id}`);
      const productData = res.data;

      // Format the product data
      const formattedProduct = {
        ...initialProductState,
        ...productData.product,
        description: productData.product.description || '', // Ensure description is never undefined
        price: productData.product.price?.toString() || "",
        quantity: productData.product.quantity?.toString() || "",
        discount: productData.product.discount?.toString() || "",
        sold: productData.product.sold?.toString() || "",
        shippingCost: productData.product.shippingCost?.toString() || "",
        variants: productData.product.variants?.map(variant => ({
          ...variant,
          additionalPrice: variant.additionalPrice?.toString() || ""
        })) || [{ size: "", color: "", additionalPrice: "" }],
        specifications: productData.product.specifications?.length > 0
          ? productData.product.specifications
          : [{ feature: "", value: "" }],
        additionalInfo: productData.product.additionalInfo?.length > 0
          ? productData.product.additionalInfo
          : [""],
        image: Array.isArray(productData.product.image) ? productData.product.image : []
      };

      setProduct(formattedProduct);
      setSelected(formattedProduct.image);
      setPreviewImages(formattedProduct.image);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to fetch product. Please try again.");
      toast.error("Failed to fetch product.");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setError(null);
      const res = await axiosInstance.get("/category");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again.");
      toast.error("Failed to fetch categories.");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setProduct(prev => {
      const newProduct = { ...prev };
      if (name === 'shippingCost') {
        newProduct[name] = value === '' ? '' : value;
      } else if (name === 'price' || name === 'quantity' || name === 'discount' || name === 'sold') {
        newProduct[name] = value === '' ? '' : value;
      } else {
        newProduct[name] = value;
      }
      newProduct.image = selected;
      return newProduct;
    });
  }, [selected]);

  const handleVariantChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [name]: value } : variant
      )
    }));
  }, []);

  const addVariant = useCallback(() => {
    setProduct(prev => ({
      ...prev,
      variants: [...prev.variants, { size: "", color: "", additionalPrice: "" }],
    }));
  }, []);

  const removeVariant = useCallback((index) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  }, []);

  const handleSpecificationChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setProduct(prev => {
      const newSpecifications = [...prev.specifications];
      newSpecifications[index] = {
        ...newSpecifications[index],
        [name]: value
      };
      return {
        ...prev,
        specifications: newSpecifications
      };
    });
  }, []);

  const addSpecification = useCallback(() => {
    setProduct(prev => ({
      ...prev,
      specifications: [...prev.specifications, { feature: "", value: "" }],
    }));
  }, []);

  const removeSpecification = useCallback((index) => {
    setProduct(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  }, []);

  const addAdditionalInfo = useCallback(() => {
    setProduct(prev => ({
      ...prev,
      additionalInfo: [...prev.additionalInfo, ""],
    }));
  }, []);

  const removeAdditionalInfo = useCallback((index) => {
    setProduct(prev => ({
      ...prev,
      additionalInfo: prev.additionalInfo.filter((_, i) => i !== index)
    }));
  }, []);

  const handleAdditionalInfoChange = useCallback((index, e) => {
    const value = e.target.value;
    setProduct(prev => ({
      ...prev,
      additionalInfo: prev.additionalInfo.map((info, i) =>
        i === index ? value : info
      )
    }));
  }, []);

  const handleImageChange = useCallback((tags) => {
    setSelected(tags);
    setPreviewImages(tags);
    setProduct(prev => ({ ...prev, image: tags }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!product.name || !product.price || !product.category) {
        throw new Error("Name, price, and category are required fields");
      }

      // Prepare product data
      const productData = {
        ...product,
        // Convert numeric fields
        price: Number(product.price),
        quantity: Number(product.quantity) || 0,
        discount: Number(product.discount) || 0,
        sold: Number(product.sold) || 0,
        shippingCost: product.shippingCost === "" ? 0 : Number(product.shippingCost),
        isStock: Boolean(product.quantity > 0),

        // Handle variants
        variants: product.variants
          .filter(variant => variant.size || variant.color || variant.additionalPrice)
          .map(variant => ({
            ...variant,
            price: Number(variant.additionalPrice) || 0,
            quantity: Number(variant.quantity) || 0,
            discount: Number(variant.discount) || 0
          })),

        // Handle specifications
        specifications: product.specifications
          .filter(spec => spec.feature && spec.value)
          .map(spec => ({
            feature: spec.feature.trim(),
            value: spec.value.trim()
          })),

        // Handle additional info
        additionalInfo: product.additionalInfo
          .filter(info => info && info.trim() !== '')
          .map(info => info.trim())
      };

      // Remove empty arrays and undefined values
      Object.keys(productData).forEach(key => {
        if (Array.isArray(productData[key]) && productData[key].length === 0) {
          delete productData[key];
        }
        if (productData[key] === undefined) {
          delete productData[key];
        }
      });

      const updateData = {
        ...productData,
        shippingCost: productData.shippingCost,
        specifications: productData.specifications || [],
        variants: productData.variants || [],
        additionalInfo: productData.additionalInfo || []
      };

      const res = await axiosInstance.put(`/products/update-product/${params.id}`, updateData);

      if (res.status === 200) {
        toast.success("Product updated successfully!");
        navigate("/admin-dashboard/all-products");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product. Please try again.");
      toast.error(error.response?.data?.message || "Failed to update product.");
    } finally {
      setLoading(false);
    }
  }, [params.id, product, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="textColor600 dark:textColor">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 max-[640px]:p-2">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-[640px]:p-2">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Product
          </h2>
          <button
            onClick={() => navigate("/all-products")}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <FaArrowLeft /> Back to Products
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 max-[640px]:p-2 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["name", "category", "price", "quantity", "brand", "sku", "returnPolicy"].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field === "category" ? (
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      name={field}
                      onChange={handleChange}
                      value={product[field] || ""}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.category}>
                          {category.category}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      name={field}
                      placeholder={`Enter ${field}`}
                      type={["price", "quantity"].includes(field) ? "number" : "text"}
                      onChange={handleChange}
                      value={product[field] || ""}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 max-[640px]:p-2 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Description</h3>
            <ReactQuill
              theme="snow"
              modules={modules}
              formats={formats}
              value={product.description}
              onChange={(content) => setProduct(prev => ({ ...prev, description: content }))}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg"
              style={{ height: '200px' }}
            />
          </div>

          {/* Images Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 max-[640px]:p-2 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Product Images</h3>
            <div className="space-y-4">
              {/* Image Upload Component */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Upload Images
                  </label>
                  <UploadImage
                    setData={(url) => {
                      setSelected(prev => [...prev, url]);
                      setPreviewImages(prev => [...prev, url]);
                      setProduct(prev => ({ ...prev, image: [...prev.image, url] }));
                    }}
                    maxFileSize={2}
                    allowedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                    className="w-full"
                    showProgress={true}
                    multiple={true}
                    folder="products"
                    onUploadEnd={() => toast.success("Image upload completed!")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Or Enter Image URLs
                  </label>
                  <TagsInput
                    value={selected}
                    onChange={handleImageChange}
                    name="image"
                    placeHolder="Enter image URL"
                    classNames={{
                      tag: "bg-blue-600 text-white px-3 py-1 rounded-full mr-2 mb-2",
                      tagInput: "w-full",
                      tagInputField: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    }}
                  />
                </div>
              </div>

              {/* Image Preview Grid */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = previewImages.filter((_, i) => i !== index);
                          setPreviewImages(newImages);
                          setSelected(newImages);
                          setProduct({ ...product, image: newImages });
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 max-[640px]:p-2 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["discount", "sold", "supplier", "warranty", "shippingCost"].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    name={field}
                    placeholder={`Enter ${field}`}
                    type={["discount", "sold", "shippingCost"].includes(field) ? "number" : "text"}
                    onChange={handleChange}
                    value={product[field] || ""}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Variants Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 max-[640px]:p-2 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Product Variants</h3>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus /> Add Variant
              </button>
            </div>
            {product?.variants?.map((variant, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                {["size", "color", "additionalPrice"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      name={field}
                      placeholder={`Enter ${field}`}
                      type={field === "additionalPrice" ? "number" : "text"}
                      onChange={(e) => handleVariantChange(index, e)}
                      value={variant[field]}
                    />
                  </div>
                ))}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Specifications Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 max-[640px]:p-2 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Specifications</h3>
              <button
                type="button"
                onClick={addSpecification}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus /> Add Specification
              </button>
            </div>
            {product?.specifications?.map((specification, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                {["feature", "value"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      name={field}
                      placeholder={`Enter ${field}`}
                      type="text"
                      onChange={(e) => handleSpecificationChange(index, e)}
                      value={specification[field]}
                    />
                  </div>
                ))}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 max-[640px]:p-2 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Information</h3>
              <button
                type="button"
                onClick={addAdditionalInfo}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus /> Add Info
              </button>
            </div>
            {product?.additionalInfo?.map((info, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <div className="flex-1">
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter additional information"
                    type="text"
                    onChange={(e) => handleAdditionalInfoChange(index, e)}
                    value={info}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAdditionalInfo(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <FaSave />
              )}
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
