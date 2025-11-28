import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaTimes,
  FaBox,
  FaTag,
  FaInfoCircle,
  FaShippingFast,
  FaTruck,
  FaShieldAlt,
  FaBarcode,
  FaIndustry,
  FaTags,
} from "react-icons/fa";

const ProductCart = ({ product, handleDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-200 cursor-pointer group dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100 ">
          <img
            src={product.image[0]}
            alt={product.name}
            className="object-cover w-full h-48 transition-transform duration-300 transform group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate dark:text-white">
              {product?.name}
            </h3>
            <div className="flex items-center gap-2">
              {product.discount > 0 && (
                <span className="text-sm font-medium textColor600 dark:textColor">
                  -{product.discount}%
                </span>
              )}
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {product.price}
                <span className="text-2xl font-bold">৳</span>
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <FaBox className="mr-1" />
              <span>{product.quantity || 0} in stock</span>
            </div>
            <div className="flex items-center">
              <FaTag className="mr-1" />
              <span>{product.category || "Uncategorized"}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to={`/admin-dashboard/edit-product/${product._id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <FaEdit className="text-sm" />
              <span>Edit</span>
            </Link>
            <button
              onClick={(e) => handleDelete(e, product._id)}
              className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-white transition-colors duration-200 bg-red-600 rounded-lg hover:bg-red-700"
            >
              <FaTrash className="text-sm" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 max-w-4xl w-full relative max-h-[70vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute text-gray-500 transition-colors top-4 right-4 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FaTimes className="text-xl cursor-pointer " />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <FaInfoCircle className="text-xl text-blue-500" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Product Details
              </h3>
            </div>

            {/* Product Image */}
            <div className="mb-6">
              <img
                src={product.image[0]}
                alt={product.name}
                className="object-contain w-full h-64 bg-gray-100 rounded-lg dark:bg-gray-700"
              />
            </div>

            {/* Product Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Basic Information */}
              <div>
                <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Name
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Brand
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.brand}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Category
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      SKU
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.sku}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Price
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.price}
                      <span className="text-2xl font-bold">৳</span>
                    </span>
                  </div>
                  {product.discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Discount
                      </span>
                      <span className="font-medium textColor600 dark:textColor">
                        -{product.discount}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock & Sales */}
              <div>
                <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Stock & Sales
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Quantity
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.quantity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Sold
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.sold}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      In Stock
                    </span>
                    <span
                      className={`font-medium ${
                        product.isStock
                          ? "text-green-600 dark:text-green-400"
                          : "textColor600 dark:textColor"
                      }`}
                    >
                      {product.isStock ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping & Warranty */}
              <div>
                <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Shipping & Warranty
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Shipping Cost
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${product.shippingCost}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Estimated Time
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.shippingDetails.estimatedTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Warranty
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.warranty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Return Policy
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.returnPolicy}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Additional Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Supplier
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.supplier}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Created At
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Updated At
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Description
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="md:col-span-2">
                  <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Specifications
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {product.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-600 dark:text-gray-300">
                          {spec.name}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="md:col-span-2">
                  <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Variants
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {product.variants.map((variant, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-300">
                            Name
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {variant.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-300">
                            Price
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {variant.price}
                            <span className="text-2xl font-bold">৳</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCart;
