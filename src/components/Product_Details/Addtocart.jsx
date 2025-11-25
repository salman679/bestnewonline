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
        <div className="relative w-full h-screen flex justify-center items-center">
          <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
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
      <div
        className="container-minimal"
        style={{
          paddingTop: "var(--space-xl)",
          paddingBottom: "var(--space-2xl)",
        }}
      >
        <ScrollToTop />

        {/* Breadcrumb - Ultra Minimal */}
        <nav className="mb-8 max-[640px]:mb-6">
          <div
            className="flex items-center gap-2 text-small"
            style={{ color: "var(--color-text-muted)" }}
          >
            <Link to={"/"} className="hover:opacity-70 transition-opacity">
              হোম
            </Link>
            <span>/</span>
            <Link
              to={"/product-category"}
              className="hover:opacity-70 transition-opacity bangla-text"
            >
              {oneProduct?.category}
            </Link>
            <span>/</span>
            <span
              style={{ color: "var(--color-text-secondary)" }}
              className="bangla-text"
            >
              {oneProduct?.name}
            </span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-[640px]:gap-8">
          {/* Image Gallery Section - Ultra Minimal */}
          <div className="w-full">
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: "var(--radius-xl)",
                backgroundColor: "var(--color-bg-soft)",
              }}
            >
              <img
                src={selectedImage ? selectedImage : productImages[0]}
                alt={oneProduct?.name}
                className="w-full h-[500px] lg:h-[600px] max-[640px]:h-[400px] object-cover transition-transform duration-500 hover:scale-105"
              />
              {oneProduct?.discount > 0 && (
                <div
                  className="badge-minimal absolute top-4 left-4"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                    padding: "8px 16px",
                    fontSize: "14px",
                  }}
                >
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
                  className="flex-shrink-0 overflow-hidden transition-all duration-300"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "var(--radius-md)",
                    border:
                      selectedImage === img
                        ? "2px solid var(--color-primary)"
                        : "2px solid var(--color-border)",
                    opacity: selectedImage === img ? 1 : 0.6,
                  }}
                >
                  <img
                    src={img}
                    alt={`${oneProduct?.name} ${index + 1}`}
                    className="w-full h-full object-cover hover:opacity-100 transition-opacity"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section - Ultra Minimal */}
          <div className="w-full">
            {/* Product Title & Wishlist */}
            <div className="flex items-start justify-between mb-6 max-[640px]:mb-4">
              <h1
                className="heading-1 bangla"
                style={{ color: "var(--color-text-primary)", flex: 1 }}
              >
                {oneProduct?.name}
              </h1>
              <button
                onClick={handleToggleWishlist}
                className="ml-4 p-3 rounded-full transition-all hover:scale-110"
                style={{ backgroundColor: "var(--color-bg-soft)" }}
              >
                <HiHeart
                  className="w-6 h-6 max-[640px]:w-5 max-[640px]:h-5"
                  style={{
                    color: isInWishlist(oneProduct?._id)
                      ? "var(--color-primary)"
                      : "var(--color-text-muted)",
                  }}
                />
              </button>
            </div>
            {/* Price Section - Ultra Minimal */}
            <div className="mb-8 max-[640px]:mb-6">
              <div className="flex items-baseline gap-3 mb-4">
                <span
                  className="price-text"
                  style={{
                    color: "var(--color-primary)",
                    fontSize: "32px",
                    lineHeight: 1,
                  }}
                >
                  ৳{finalPrice.toFixed(0)}
                </span>
                {oneProduct?.discount > 0 && (
                  <>
                    <span
                      className="text-lg line-through"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      ৳{basePrice.toFixed(0)}
                    </span>
                    <span
                      className="badge-minimal"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "white",
                        padding: "4px 12px",
                        fontSize: "12px",
                      }}
                    >
                      {oneProduct.discount.toFixed(0)}% ছাড়
                    </span>
                  </>
                )}
              </div>
              {oneProduct?.quantity > 0 ? (
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: "#F0FDF4",
                    border: "1px solid #86EFAC",
                  }}
                >
                  <span
                    className="text-small font-medium bangla-text"
                    style={{ color: "#166534" }}
                  >
                    স্টকে আছে
                  </span>
                  <span className="text-small" style={{ color: "#166534" }}>
                    ({oneProduct?.quantity}টি)
                  </span>
                </div>
              ) : (
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #FECACA",
                  }}
                >
                  <span
                    className="text-small font-medium bangla-text"
                    style={{ color: "#991B1B" }}
                  >
                    স্টক নেই
                  </span>
                </div>
              )}
            </div>
            {/* Variants Section - Ultra Minimal */}
            {oneProduct?.variants?.some((variant) => variant.color) ? (
              <div className="mb-8 max-[640px]:mb-6">
                <div
                  className="pb-6"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  {/* Color Selection */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className="heading-3 bangla"
                        style={{
                          color: "#111827",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        রং:{" "}
                        <span className="text-gray-500 font-normal ml-2">
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
                          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            selectedColor === color
                              ? "ring-2 ring-offset-1"
                              : "hover:border-gray-400"
                          }`}
                          style={{
                            backgroundColor: "white",
                            color:
                              selectedColor === color ? "#016737" : "#374151",
                            border:
                              selectedColor === color
                                ? "2px solid #016737"
                                : "1px solid #E5E7EB",
                            minWidth: "80px",
                            boxShadow:
                              selectedColor === color
                                ? "0 2px 5px rgba(0,0,0,0.05)"
                                : "none",
                            "--tw-ring-color": "#016737",
                          }}
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
                  {selectedColor && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3
                          className="heading-3 bangla"
                          style={{
                            color: "#111827",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          সাইজ:{" "}
                          <span className="text-gray-500 font-normal ml-2">
                            {selectedSize || "সিলেক্ট করুন"}
                          </span>
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {[
                          ...new Set(
                            oneProduct.variants
                              .filter(
                                (variant) => variant.color === selectedColor
                              )
                              .map((variant) => variant.size)
                              .filter(Boolean)
                          ),
                        ].map((size, index) => {
                          const variant = oneProduct.variants.find(
                            (v) => v.color === selectedColor && v.size === size
                          );
                          const additionalPrice = variant?.additionalPrice || 0;

                          return (
                            <button
                              key={index}
                              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                                selectedSize === size
                                  ? "ring-2 ring-offset-1"
                                  : "hover:border-gray-400"
                              }`}
                              style={{
                                backgroundColor: "white",
                                color:
                                  selectedSize === size ? "#016737" : "#374151",
                                border:
                                  selectedSize === size
                                    ? "2px solid #016737"
                                    : "1px solid #E5E7EB",
                                minWidth: "70px",
                                boxShadow:
                                  selectedSize === size
                                    ? "0 2px 5px rgba(0,0,0,0.05)"
                                    : "none",
                                "--tw-ring-color": "#016737",
                              }}
                              onClick={() =>
                                handleSizeSelection(size, additionalPrice)
                              }
                            >
                              {size}
                              {additionalPrice > 0 && (
                                <span className="ml-1 text-xs text-gray-500 font-normal">
                                  (+৳{additionalPrice})
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              oneProduct?.variants?.length > 0 && (
                <div
                  className="mb-8 max-[640px]:mb-6 pb-6"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="heading-3 bangla"
                      style={{
                        color: "#111827",
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      সাইজ:{" "}
                      <span className="text-gray-500 font-normal ml-2">
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
                          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                            selectedSize === size
                              ? "ring-2 ring-offset-1"
                              : "hover:border-gray-400"
                          }`}
                          style={{
                            backgroundColor: "white",
                            color:
                              selectedSize === size ? "#016737" : "#374151",
                            border:
                              selectedSize === size
                                ? "2px solid #016737"
                                : "1px solid #E5E7EB",
                            minWidth: "70px",
                            boxShadow:
                              selectedSize === size
                                ? "0 2px 5px rgba(0,0,0,0.05)"
                                : "none",
                            "--tw-ring-color": "#016737",
                          }}
                          onClick={() =>
                            handleSizeSelection(size, additionalPrice)
                          }
                        >
                          {size}
                          {additionalPrice > 0 && (
                            <span className="ml-1 text-xs text-gray-500 font-normal">
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
            <div className="mb-8 max-[640px]:mb-6">
              <h3
                className="heading-3 bangla mb-4"
                style={{ color: "var(--color-text-primary)" }}
              >
                পরিমাণ
              </h3>
              <div
                className="flex items-center rounded-lg overflow-hidden w-max"
                style={{ border: "1px solid var(--color-border)" }}
              >
                <button
                  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                  className="px-4 py-3 transition-colors"
                  style={{
                    backgroundColor: "var(--color-bg-soft)",
                    color: "var(--color-text-primary)",
                    borderRight: "1px solid var(--color-border)",
                  }}
                >
                  <FaMinus className="w-4 h-4" />
                </button>
                <span
                  className="px-6 py-3 text-lg font-semibold"
                  style={{
                    color: "var(--color-text-primary)",
                    minWidth: "60px",
                    textAlign: "center",
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 transition-colors"
                  style={{
                    backgroundColor: "var(--color-bg-soft)",
                    color: "var(--color-text-primary)",
                    borderLeft: "1px solid var(--color-border)",
                  }}
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons - Ultra Minimal */}
            <div className="flex flex-col gap-3 mb-8">
              <button
                onClick={handleBuyNow}
                className="btn-minimal btn-primary w-full py-4 bangla-text btn-text transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px 24px",
                  minHeight: "52px",
                  backgroundColor: "#016737",
                  color: "#ffffff",
                  borderRadius: "9999px",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  fontFamily: "Hind Siliguri, sans-serif",
                  width: "100%",
                }}
              >
                এখনই কিনুন
              </button>
              <button
                onClick={handleAddToCart}
                className="btn-minimal btn-outline w-full py-4 bangla-text btn-text transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px 24px",
                  minHeight: "52px",
                  backgroundColor: "transparent",
                  color: "#016737",
                  borderRadius: "9999px",
                  border: "1px solid #e5e7eb",
                  fontSize: "16px",
                  fontWeight: "600",
                  fontFamily: "Hind Siliguri, sans-serif",
                  width: "100%",
                }}
              >
                কার্টে যুক্ত করুন
              </button>

              {/* WhatsApp Order Button */}
              {siteSettings?.socialMedia?.whatsAppLink && (
                <a
                  href={siteSettings?.socialMedia?.whatsAppLink}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: "#25D366", color: "white" }}
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
            <div
              className="pt-6"
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p
                    className="text-small mb-1"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    SKU
                  </p>
                  <p
                    className="body-text font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {oneProduct?.sku}
                  </p>
                </div>
                <div>
                  <p
                    className="text-small mb-1 bangla-text"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    ক্যাটাগরি
                  </p>
                  <p
                    className="body-text font-medium bangla-text"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {oneProduct?.category}
                  </p>
                </div>
              </div>

              {/* Social Share */}
              <div className="flex items-center gap-4">
                <span
                  className="text-small bangla-text"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  শেয়ার করুন:
                </span>
                <div className="flex gap-3">
                  {siteSettings?.socialMedia?.facebook && (
                    <a
                      href={siteSettings?.socialMedia?.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        backgroundColor: "var(--color-bg-soft)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      <FaFacebook className="w-4 h-4" />
                    </a>
                  )}
                  {siteSettings?.socialMedia?.twitter && (
                    <a
                      href={siteSettings?.socialMedia?.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        backgroundColor: "var(--color-bg-soft)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      <FaTwitter className="w-4 h-4" />
                    </a>
                  )}
                  {siteSettings?.socialMedia?.instagram && (
                    <a
                      href={siteSettings?.socialMedia?.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        backgroundColor: "var(--color-bg-soft)",
                        color: "var(--color-text-secondary)",
                      }}
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
