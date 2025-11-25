import { useContext } from "react";
import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { WishlistContext } from "../../context/WishlistContext";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const formatPrice = (price) => {
    return (
      price?.toLocaleString("en-BD", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }) || "0"
    );
  };

  const handleAddToCart = (item) => {
    const product = {
      _id: item.productId,
      name: item.name,
      price: item.price,
      image: [item.image],
    };
    addToCart(product, 1);
    toggleWishlist(product);
    toast.success(`${item.name} added to cart!`);
  };

  const removeFromWishlist = (item) => {
    toggleWishlist({
      _id: item.productId,
      name: item.name,
      price: item.price,
      image: [item.image],
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAFAFA",
        padding: "48px 24px",
      }}
      className="max-[640px]:pt-6"
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "600",
                fontFamily: "Hind Siliguri, sans-serif",
                color: "#1A1A1A",
                marginBottom: "4px",
              }}
              className="max-[640px]:text-2xl"
            >
              আপনার পছন্দের তালিকা
            </h1>
            <div
              style={{
                height: "3px",
                width: "60px",
                backgroundColor: "#016737",
                borderRadius: "2px",
              }}
            />
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "#666666",
              fontFamily: "Hind Siliguri, sans-serif",
            }}
          >
            {wishlist.length}টি পণ্য
          </p>
        </div>

        <AnimatePresence mode="wait">
          {wishlist.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
              {wishlist.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #F0F0F0",
                    overflow: "hidden",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  className="group hover:shadow-lg"
                >
                  {/* Image Container */}
                  <Link
                    to={`/products/${product.slug}`}
                    style={{
                      position: "relative",
                      display: "block",
                      width: "100%",
                      height: "240px",
                      overflow: "hidden",
                      backgroundColor: "#F5F5F5",
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition:
                          "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
                      }}
                      className="group-hover:scale-110"
                    />
                    {product.discount > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          backgroundColor: "#DC2626",
                          color: "#FFFFFF",
                          fontSize: "12px",
                          fontWeight: "600",
                          padding: "4px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        {product.discount}% OFF
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(product);
                      }}
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <FaHeart style={{ color: "#DC2626", fontSize: "16px" }} />
                    </motion.button>
                  </Link>

                  {/* Product Info */}
                  <div style={{ padding: "16px" }}>
                    <Link
                      to={`/products/${product.slug}`}
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        fontFamily: "Hind Siliguri, sans-serif",
                        color: "#1A1A1A",
                        marginBottom: "8px",
                        textDecoration: "none",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        transition: "color 0.2s ease",
                      }}
                      className="hover:text-[#016737]"
                    >
                      {product.name}
                    </Link>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#016737",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          ৳
                          {(
                            product.price -
                            (product.price * (product.discount || 0)) / 100
                          ).toFixed(0)}
                        </span>
                        {product.discount > 0 && (
                          <span
                            style={{
                              fontSize: "14px",
                              color: "#999999",
                              textDecoration: "line-through",
                              fontFamily: "Inter, sans-serif",
                            }}
                          >
                            ৳{product.price.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-8 sm:py-12 px-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-6 sm:mb-8"
              >
                <FaHeart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600" />
              </motion.div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  fontFamily: "Hind Siliguri, sans-serif",
                  color: "#1A1A1A",
                  textAlign: "center",
                  marginBottom: "12px",
                }}
                className="max-[640px]:text-xl"
              >
                আপনার পছন্দের তালিকা খালি
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666666",
                  fontFamily: "Hind Siliguri, sans-serif",
                  textAlign: "center",
                  maxWidth: "400px",
                  marginBottom: "32px",
                }}
              >
                পণ্য ব্রাউজ করুন এবং আপনার পছন্দের পণ্য যোগ করুন
              </p>
              <Link
                to="/product-category"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "12px 24px",
                  backgroundColor: "#016737",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  fontFamily: "Hind Siliguri, sans-serif",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                className="hover:opacity-90"
              >
                কেনাকাটা শুরু করুন
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;
