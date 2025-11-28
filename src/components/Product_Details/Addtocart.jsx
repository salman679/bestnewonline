import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import { Navigation } from "swiper/modules";
import {
  FaFacebook,
  FaHeart,
  FaInstagram,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./styles.css";
import { IndexContext } from "../../context";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/auth/AuthContext";
import { toast } from "react-hot-toast";
import { WishlistContext } from "../../context/WishlistContext";
import { HiHeart } from "react-icons/hi2";
import useLocalStorage from "../../hooks/useLocalStorage";
import ScrollToTop from "../ScrollToTop";

function Addtocart({ oneProduct, isLoading }) {
  const [price, setPrice] = useState(0);
  const { siteSettings } = useContext(IndexContext);
  const { addToCart, addToCartBuyNow } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useLocalStorage("isCartOpen", false);
  const [basePrice, setBasePrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [selectedAditionalPrice, setSelectedAditionalPrice] = useState(0);

  const productImages = oneProduct?.image || [];

  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    oneProduct?.variants?.[0]?.color || "Black"
  );
  const [selectedSize, setSelectedSize] = useState(
    oneProduct?.variants?.[0]?.size || "Default"
  );

  // Calculate initial price with discount when product loads
  useEffect(() => {
    if (oneProduct) {
      // Calculate base price with additional price
      const baseWithAdditional = oneProduct.price + selectedAditionalPrice;
      setBasePrice(baseWithAdditional);

      // Calculate discounted price
      const discountAmount =
        (baseWithAdditional * (oneProduct.discount || 0)) / 100;
      const finalDiscountedPrice = baseWithAdditional - discountAmount;
      setFinalPrice(finalDiscountedPrice);
    }
  }, [oneProduct, selectedAditionalPrice]);

  // Handle size selection
  const handleSizeSelection = (size, additionalPrice) => {
    setSelectedSize(size);
    setSelectedAditionalPrice(additionalPrice || 0);
  };

  if (isLoading) {
    return (
      <div className="h-screen">
        {" "}
        <div className="relative flex items-center justify-center w-full h-screen">
          <div className="absolute w-32 h-32 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
          <img
            src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
            className="rounded-full h-28 w-28"
          />
        </div>
      </div>
    );
  }

  const handleBuyNow = () => {
    if (oneProduct) {
      const productToAdd = {
        ...oneProduct,
        finalPrice: finalPrice, // Use calculated final price
        basePrice: basePrice, // Include base price for reference
        selectedColor,
        selectedSize,
        selectedAditionalPrice,
        quantity,
        // Calculate total with quantity
        total: finalPrice * quantity,
      };

      try {
        addToCartBuyNow(productToAdd, quantity);
        navigate("/checkout");
      } catch (error) {
        console.error("Error processing buy now:", error);
        toast.error("Failed to process. Please try again.");
      }
    }
  };

  const handleAddToCart = () => {
    if (oneProduct) {
      const productToAdd = {
        ...oneProduct,
        finalPrice: finalPrice, // Use calculated final price
        basePrice: basePrice, // Include base price for reference
        selectedColor,
        selectedSize,
        selectedAditionalPrice,
        quantity,
        // Calculate total with quantity
        total: finalPrice * quantity,
      };
      addToCart(productToAdd, quantity);
      setIsCartOpen(true);
    }
  };

  const handleToggleWishlist = () => {
    if (oneProduct) {
      toggleWishlist(oneProduct);
    }
  };

  return (
    <>
      <div className="pt-8 pb-12 container-minimal">
        <ScrollToTop />

        {/* Breadcrumb - Ultra Minimal */}
        <nav className="mb-8 max-sm:mb-6">
          <div className="flex items-center gap-2 text-gray-400 text-small">
            <Link to={"/"} className="transition-opacity hover:opacity-70">
              হোম
            </Link>
            <span>/</span>
            <Link
              to={"/product-category"}
              className="transition-opacity hover:opacity-70 bangla-text"
            >
              {oneProduct?.category}
            </Link>
            <span>/</span>
            <span className="text-gray-600 bangla-text">
              {oneProduct?.name}
            </span>
          </div>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 max-sm:gap-8">
          {/* Image Gallery Section - Ultra Minimal */}
          <div className="w-full">
            <div className="relative overflow-hidden rounded-2xl bg-gray-50">
              <img
                src={
                  (selectedImage || productImages[0])?.includes(
                    "ik.imagekit.io"
                  )
                    ? `${
                        selectedImage || productImages[0]
                      }?tr=w-600,h-600,f-webp,q-85`
                    : selectedImage || productImages[0]
                }
                alt={oneProduct?.name}
                width={600}
                height={600}
                fetchPriority="high"
                loading="eager"
                className="w-full h-[500px] lg:h-[600px] max-sm:h-[400px] object-cover transition-transform duration-500 hover:scale-105"
              />
              {oneProduct?.discount > 0 && (
                <div className="absolute px-4 py-2 text-sm text-white badge-minimal top-4 left-4 bg-primary">
                  -{oneProduct.discount.toFixed(0)}%
                </div>
              )}
            </div>
            {/* Thumbnail Gallery */}
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {productImages?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`flex shrink-0 overflow-hidden transition-all duration-300 w-20 h-20 rounded-lg ${
                    selectedImage === img
                      ? "opacity-100 ring-1 ring-black/10"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={
                      img?.includes("ik.imagekit.io")
                        ? `${img}?tr=w-80,h-80,f-webp,q-70`
                        : img
                    }
                    alt={`${oneProduct?.name} ${index + 1}`}
                    width={80}
                    height={80}
                    loading="lazy"
                    decoding="async"
                    className="object-cover w-full h-full transition-opacity hover:opacity-100"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section - Ultra Minimal */}
          <div className="w-full">
            {/* Product Title & Wishlist */}
            <div className="flex items-start justify-between mb-6 max-sm:mb-4">
              <h1 className="flex-1 text-gray-900 heading-1 bangla">
                {oneProduct?.name}
              </h1>
              <button
                onClick={handleToggleWishlist}
                className="p-3 ml-4 transition-all rounded-full hover:scale-110 bg-gray-50"
              >
                <HiHeart
                  className={`w-6 h-6 max-sm:w-5 max-sm:h-5 ${
                    isInWishlist(oneProduct?._id)
                      ? "text-primary"
                      : "text-gray-400"
                  }`}
                />
              </button>
            </div>
            {/* Price Section - Ultra Minimal */}
            <div className="mb-8 max-sm:mb-6">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl leading-none price-text text-primary">
                  ৳{finalPrice.toFixed(0)}
                </span>
                {oneProduct?.discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ৳{basePrice.toFixed(0)}
                    </span>
                    <span className="px-3 py-1 text-xs text-white badge-minimal bg-primary">
                      {oneProduct.discount.toFixed(0)}% ছাড়
                    </span>
                  </>
                )}
              </div>
              {oneProduct?.quantity > 0 ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-green-200 rounded-full bg-green-50">
                  <span className="font-medium text-green-700 text-small bangla-text">
                    স্টকে আছে
                  </span>
                  <span className="text-green-700 text-small">
                    ({oneProduct?.quantity}টি)
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 rounded-full bg-red-50">
                  <span className="font-medium text-red-700 text-small bangla-text">
                    স্টক নেই
                  </span>
                </div>
              )}
            </div>
            {/* Variants Section - Ultra Minimal */}
            {oneProduct?.variants?.some((variant) => variant.color) ? (
              <div className="mb-8 max-sm:mb-6">
                <div className="pb-6 border-b border-gray-200">
                  {/* Color Selection */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-gray-900 heading-3 bangla">
                        রং:{" "}
                        <span className="ml-2 font-normal text-gray-500">
                          {selectedColor}
                        </span>
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {[
                        ...new Set(
                          oneProduct.variants
                            .map((v) => v.color)
                            .filter(Boolean)
                        ),
                      ].map((color, index) => (
                        <button
                          key={index}
                          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 min-w-[80px] ${
                            selectedColor === color
                              ? "bg-brand-primary shadow-sm"
                              : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                          }`}
                          onClick={() => {
                            setSelectedColor(color);
                            setSelectedSize(null);
                            setSelectedAditionalPrice(0);
                          }}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  {selectedColor &&
                    (() => {
                      const availableSizes = [
                        ...new Set(
                          oneProduct.variants
                            .filter((v) => v.color === selectedColor)
                            .map((v) => v.size)
                            .filter(Boolean)
                        ),
                      ];

                      if (availableSizes.length === 0) return null;

                      return (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-semibold text-gray-900 heading-3 bangla">
                              সাইজ:{" "}
                              <span className="ml-2 font-normal text-gray-500">
                                {selectedSize || "সিলেক্ট করুন"}
                              </span>
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {availableSizes.map((size, index) => {
                              const variant = oneProduct.variants.find(
                                (v) =>
                                  v.color === selectedColor && v.size === size
                              );
                              const additionalPrice =
                                variant?.additionalPrice || 0;

                              return (
                                <button
                                  key={index}
                                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center min-w-[70px] ${
                                    selectedSize === size
                                      ? "bg-brand-primary shadow-sm"
                                      : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                                  }`}
                                  onClick={() =>
                                    handleSizeSelection(size, additionalPrice)
                                  }
                                >
                                  {size}
                                  {additionalPrice > 0 && (
                                    <span className="ml-1 text-xs font-normal text-gray-500">
                                      (+৳{additionalPrice})
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                </div>
              </div>
            ) : (
              oneProduct?.variants?.some((v) => v.size) && (
                <div className="pb-6 mb-8 border-b border-gray-200 max-sm:mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-900 heading-3 bangla">
                      সাইজ:{" "}
                      <span className="ml-2 font-medium text-gray-500">
                        {selectedSize || "সিলেক্ট করুন"}
                      </span>
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {[
                      ...new Set(
                        oneProduct.variants
                          .map((variant) => variant.size)
                          .filter(Boolean)
                      ),
                    ].map((size, index) => {
                      const variant = oneProduct.variants.find(
                        (v) => v.size === size
                      );
                      const additionalPrice = variant?.additionalPrice || 0;

                      return (
                        <button
                          key={index}
                          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center min-w-[70px] ${
                            selectedSize === size
                              ? "bg-brand-primary shadow-sm"
                              : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                          }`}
                          onClick={() =>
                            handleSizeSelection(size, additionalPrice)
                          }
                        >
                          {size}
                          {additionalPrice > 0 && (
                            <span className="ml-1 text-xs font-normal text-gray-500">
                              (+৳{additionalPrice})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            )}

            {/* Quantity & Actions - Ultra Minimal */}
            <div className="mb-8 max-sm:mb-6">
              <h3 className="mb-4 text-gray-900 heading-3 bangla">পরিমাণ</h3>
              <div className="flex items-center overflow-hidden border border-gray-200 rounded-lg w-max">
                <button
                  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                  className="px-4 py-3 text-gray-900 transition-colors border-r border-gray-200 bg-gray-50"
                >
                  <FaMinus className="w-4 h-4" />
                </button>
                <span className="px-6 py-3 text-lg font-semibold text-gray-900 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-gray-900 transition-colors border-l border-gray-200 bg-gray-50"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons - Ultra Minimal */}
            <div className="flex flex-col gap-3 mb-8">
              <button
                onClick={handleBuyNow}
                className="btn-minimal btn-primary w-full py-4 bangla-text btn-text transition-transform hover:scale-[1.02] active:scale-[0.98] min-h-[52px] text-base font-semibold"
              >
                এখনই কিনুন
              </button>
              <button
                onClick={handleAddToCart}
                className="btn-minimal btn-outline w-full py-4 bangla-text btn-text transition-transform hover:scale-[1.02] active:scale-[0.98] min-h-[52px] text-base font-semibold"
              >
                কার্টে যুক্ত করুন
              </button>

              {/* WhatsApp Order Button */}
              {siteSettings?.socialMedia?.whatsAppLink && (
                <a
                  href={siteSettings?.socialMedia?.whatsAppLink}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-lg font-semibold transition-all hover:scale-[1.02] bg-[#25D366] text-white"
                >
                  <img
                    src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
                    className="w-5 h-5"
                    alt="WhatsApp"
                  />
                  <span className="bangla-text">হোয়াটসঅ্যাপে অর্ডার করুন</span>
                </a>
              )}
            </div>

            {/* Product Meta Info - Ultra Minimal */}
            <div className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="mb-1 text-gray-400 text-small">SKU</p>
                  <p className="font-medium text-gray-900 body-text">
                    {oneProduct?.sku}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-gray-400 text-small bangla-text">
                    ক্যাটাগরি
                  </p>
                  <p className="font-medium text-gray-900 body-text bangla-text">
                    {oneProduct?.category}
                  </p>
                </div>
              </div>

              {/* Social Share */}
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-small bangla-text">
                  শেয়ার করুন:
                </span>
                <div className="flex gap-3">
                  {siteSettings?.socialMedia?.facebook && (
                    <a
                      href={siteSettings?.socialMedia?.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center text-gray-600 transition-all rounded-full w-9 h-9 hover:scale-110 bg-gray-50"
                    >
                      <FaFacebook className="w-4 h-4" />
                    </a>
                  )}
                  {siteSettings?.socialMedia?.twitter && (
                    <a
                      href={siteSettings?.socialMedia?.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center text-gray-600 transition-all rounded-full w-9 h-9 hover:scale-110 bg-gray-50"
                    >
                      <FaTwitter className="w-4 h-4" />
                    </a>
                  )}
                  {siteSettings?.socialMedia?.instagram && (
                    <a
                      href={siteSettings?.socialMedia?.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center text-gray-600 transition-all rounded-full w-9 h-9 hover:scale-110 bg-gray-50"
                    >
                      <FaInstagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Addtocart;
