import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../lib/axiosInstanace";
import { useNavigate } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import { FaPlus, FaTrash, FaSave, FaArrowLeft } from "react-icons/fa";
import UploadImage from "../../../components/uploadImage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./styles.css";

export default function AddProduct() {
  const navigate = useNavigate();
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
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "link",
    "image",
    "video",
  ];

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

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setProduct((prev) => {
        const newProduct = { ...prev };
        if (name === "shippingCost") {
          newProduct[name] = value === "" ? "" : value;
        } else if (
          name === "price" ||
          name === "quantity" ||
          name === "discount" ||
          name === "sold"
        ) {
          newProduct[name] = value === "" ? "" : value;
        } else {
          newProduct[name] = value;
        }
        newProduct.image = selected;
        return newProduct;
      });
    },
    [selected]
  );

  const handleVariantChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [name]: value } : variant
      ),
    }));
  }, []);

  const addVariant = useCallback(() => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { size: "", color: "", additionalPrice: "" },
      ],
    }));
  }, []);

  const removeVariant = useCallback((index) => {
    setProduct((prev) => ({
      ...prev,
      varians: prev.variants.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSpecificationChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setProduct((prev) => {
      const newSpecifications = [...prev.specifications];
      newSpecifications[index] = {
        ...newSpecifications[index],
        [name]: value,
      };
      return {
        ...prev,
        specifications: newSpecifications,
      };
    });
  }, []);

  const addSpecification = useCallback(() => {
    setProduct((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { feature: "", value: "" }],
    }));
  }, []);

  const removeSpecification = useCallback((index) => {
    setProduct((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  }, []);

  const addAdditionalInfo = useCallback(() => {
    setProduct((prev) => ({
      ...prev,
      additionalInfo: [...prev.additionalInfo, ""],
    }));
  }, []);

  const removeAdditionalInfo = useCallback((index) => {
    setProduct((prev) => ({
      ...prev,
      additionalInfo: prev.additionalInfo.filter((_, i) => i !== index),
    }));
  }, []);

  const handleAdditionalInfoChange = useCallback((index, e) => {
    const value = e.target.value;
    setProduct((prev) => ({
      ...prev,
      additionalInfo: prev.additionalInfo.map((info, i) =>
        i === index ? value : info
      ),
    }));
  }, []);

  const handleImageChange = useCallback((tags) => {
    setSelected(tags);
    setPreviewImages(tags);
    setProduct((prev) => ({ ...prev, image: tags }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
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
          shippingCost:
            product.shippingCost === "" ? 0 : Number(product.shippingCost),
          isStock: Boolean(product.quantity > 0),

          // Handle variants
          variants: product.variants
            .filter(
              (variant) =>
                variant.size || variant.color || variant.additionalPrice
            )
            .map((variant) => ({
              ...variant,
              price: Number(variant.additionalPrice) || 0,
              quantity: Number(variant.quantity) || 0,
              discount: Number(variant.discount) || 0,
            })),

          // Handle specifications
          specifications: product.specifications
            .filter((spec) => spec.feature && spec.value)
            .map((spec) => ({
              feature: spec.feature.trim(),
              value: spec.value.trim(),
            })),

          // Handle additional info
          additionalInfo: product.additionalInfo
            .filter((info) => info && info.trim() !== "")
            .map((info) => info.trim()),
        };

        // Remove empty arrays and undefined values
        Object.keys(productData).forEach((key) => {
          if (
            Array.isArray(productData[key]) &&
            productData[key].length === 0
          ) {
            delete productData[key];
          }
          if (productData[key] === undefined) {
            delete productData[key];
          }
        });

        const res = await axiosInstance.post(`/products`, productData);

        if (res.status === 201) {
          toast.success("Product added successfully!");
          navigate("/admin-dashboard/all-products");
        }
      } catch (error) {
        console.error("Error adding product:", error);
        setError("Failed to add product. Please try again.");
        toast.error(error.response?.data?.message || "Failed to add product.");
      } finally {
        setLoading(false);
      }
    },
    [product, navigate]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#016737]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
          <p className="textColor600 dark:textColor">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[#016737] text-white rounded-lg hover:bg-[#034425] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a new product with detailed information
          </p>
        </div>
        <button
          onClick={() => navigate("/admin-dashboard/all-products")}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
      </div>

      <div className="mx-auto max-w-7xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 max-[640px]:p-4">
            <div className="pb-4 mb-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Fill in the basic details of your product
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                "name",
                "category",
                "price",
                "quantity",
                "brand",
                "sku",
                "returnPolicy",
              ].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field === "category" ? (
                    <select
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      name={field}
                      placeholder={`Enter ${
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }`}
                      type={
                        ["price", "quantity"].includes(field)
                          ? "number"
                          : "text"
                      }
                      onChange={handleChange}
                      value={product[field] || ""}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 max-[640px]:p-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Product Description
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Provide a detailed description of your product
                </p>
              </div>
            </div>
            <ReactQuill
              theme="snow"
              modules={modules}
              formats={formats}
              value={product.description}
              onChange={(content) =>
                setProduct((prev) => ({ ...prev, description: content }))
              }
              className="text-gray-900 bg-white rounded-lg dark:bg-gray-800 dark:text-white"
              style={{ height: "200px", marginBottom: "40px" }}
            />
          </div>

          {/* Images Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 max-[640px]:p-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Product Images
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upload or provide URLs for product images
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Upload Images
                  </label>
                  <div className="p-4 border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600">
                    <UploadImage
                      setData={(url) => {
                        setSelected((prev) => [...prev, url]);
                        setPreviewImages((prev) => [...prev, url]);
                        setProduct((prev) => ({
                          ...prev,
                          image: [...prev.image, url],
                        }));
                      }}
                      maxFileSize={2}
                      allowedFileTypes={[
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                      ]}
                      className="w-full"
                      showProgress={true}
                      multiple={true}
                      folder="products"
                      onUploadEnd={() =>
                        toast.success("Image upload completed!")
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Image URLs
                  </label>
                  <TagsInput
                    value={selected}
                    onChange={handleImageChange}
                    name="image"
                    placeHolder="Enter image URL and press enter"
                    classNames={{
                      tag: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full mr-2 mb-2",
                      tagInput: "w-full",
                      tagInputField:
                        "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                    }}
                  />
                </div>
              </div>

              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-4">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-full h-full border border-gray-200 rounded-lg dark:border-gray-700"
                      />
                      <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black rounded-lg opacity-0 bg-opacity-40 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = previewImages.filter(
                              (_, i) => i !== index
                            );
                            setPreviewImages(newImages);
                            setSelected(newImages);
                            setProduct({ ...product, image: newImages });
                          }}
                          className="p-2 text-white transition-colors bg-red-500 rounded-full hover:bg-red-600"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 max-[640px]:p-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Additional Details
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Provide additional product information
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {["discount", "sold", "supplier", "warranty", "shippingCost"].map(
                (field) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <div className="relative">
                      {["discount", "shippingCost"].includes(field) && (
                        <span className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2">
                          $
                        </span>
                      )}
                      <input
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          ["discount", "shippingCost"].includes(field)
                            ? "pl-8"
                            : ""
                        }`}
                        name={field}
                        placeholder={`Enter ${
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }`}
                        type={
                          ["discount", "sold", "shippingCost"].includes(field)
                            ? "number"
                            : "text"
                        }
                        onChange={handleChange}
                        value={product[field] || ""}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Variants Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 max-[640px]:p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 002-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Product Variants
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add different versions of your product
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 px-4 py-2 bg-[#016737] text-white rounded-lg hover:bg-[#034425] transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm"
              >
                <FaPlus className="text-sm" /> Add Variant
              </button>
            </div>
            <div className="space-y-4">
              {product?.variants?.map((variant, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {["size", "color", "additionalPrice"].map((field) => (
                      <div key={field} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <div className="relative">
                          {field === "additionalPrice" && (
                            <span className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2">
                              $
                            </span>
                          )}
                          <input
                            className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                              field === "additionalPrice" ? "pl-8" : ""
                            }`}
                            name={field}
                            placeholder={`Enter ${
                              field.charAt(0).toUpperCase() + field.slice(1)
                            }`}
                            type={
                              field === "additionalPrice" ? "number" : "text"
                            }
                            onChange={(e) => handleVariantChange(index, e)}
                            value={variant[field]}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="w-full px-4 py-2.5 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 max-[640px]:p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Specifications
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add technical details and features
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={addSpecification}
                className="flex items-center gap-2 px-4 py-2 bg-[#016737] text-white rounded-lg hover:bg-[#034425] transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm"
              >
                <FaPlus className="text-sm" /> Add Specification
              </button>
            </div>
            <div className="space-y-4">
              {product?.specifications?.map((specification, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {["feature", "value"].map((field) => (
                      <div key={field} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          name={field}
                          placeholder={`Enter ${
                            field.charAt(0).toUpperCase() + field.slice(1)
                          }`}
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
                        className="w-full px-4 py-2.5 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 max-[640px]:p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Additional Information
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add any other relevant details
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={addAdditionalInfo}
                className="flex items-center gap-2 px-4 py-2 bg-[#016737] text-white rounded-lg hover:bg-[#034425] transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm"
              >
                <FaPlus className="text-sm" /> Add Info
              </button>
            </div>
            <div className="space-y-4">
              {product?.additionalInfo?.map((info, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-1">
                    <input
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter additional information"
                      type="text"
                      onChange={(e) => handleAdditionalInfoChange(index, e)}
                      value={info}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAdditionalInfo(index)}
                    className="px-4 py-2.5 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 max-[640px]:p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Ready to publish?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Double-check your information before adding the product
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-[#016737] text-white rounded-lg hover:bg-[#034425] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                    <span>Adding Product...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="text-lg" />
                    <span>Add Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
