import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/auth/AuthContext";
import {
  FaTrash,
  FaShoppingCart,
  FaTimes,
  FaArrowRight,
  FaBoxOpen,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
// import AuthModal from "../auth/AuthModal"
import { toast } from "react-hot-toast";

// Utility function to calculate discounted price
const calculateDiscountedPrice = (price, discount) => {
  if (!discount) return price;
  return price - (price * discount) / 100;
};

const SidebarCart = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    handleCheckout,
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const discountedPrice = calculateDiscountedPrice(
        item.price,
        item.discount
      );
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  const handleQuantityUpdate = (productId, newQuantity) => {
    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast.success("Item removed from cart");
  };

  const formatPrice = (price) => {
    return price;
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className={`fixed top-0 right-0 z-[1000] w-full max-w-[400px] h-screen bg-white dark:bg-gray-900 shadow-2xl 
                ${location.pathname === "/shopping-cart" && "hidden"} 
                max-md:w-full max-md:max-w-none`}
            >
              <div
                style={{
                  height: "100vh",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header - Ultra Modern */}
                <div
                  style={{
                    padding: "24px",
                    borderBottom: "1px solid #F0F0F0",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <FaShoppingCart
                          style={{ fontSize: "24px", color: "#016737" }}
                        />
                        {cart.length > 0 && (
                          <span
                            style={{
                              position: "absolute",
                              top: "-8px",
                              right: "-8px",
                              backgroundColor: "#016737",
                              color: "#FFFFFF",
                              fontSize: "11px",
                              fontWeight: "700",
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {cart.length}
                          </span>
                        )}
                      </div>
                      <h2
                        style={{
                          fontSize: "20px",
                          fontWeight: "600",
                          fontFamily: "Hind Siliguri, sans-serif",
                          color: "#1A1A1A",
                        }}
                      >
                        কার্ট
                      </h2>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      style={{
                        padding: "8px",
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      className="hover:bg-[#F5F5F5]"
                      aria-label="Close cart"
                    >
                      <FaTimes style={{ fontSize: "20px", color: "#666666" }} />
                    </button>
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#999999",
                      marginTop: "8px",
                      fontFamily: "Hind Siliguri, sans-serif",
                    }}
                  >
                    {cart.length}টি পণ্য
                  </p>
                </div>

                {/* Product List - Modern Scroll */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                  {cart.length === 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        textAlign: "center",
                        padding: "48px 24px",
                      }}
                    >
                      <FaBoxOpen
                        style={{
                          fontSize: "64px",
                          color: "#E0E0E0",
                          marginBottom: "16px",
                        }}
                      />
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#666666",
                          fontFamily: "Hind Siliguri, sans-serif",
                          marginBottom: "8px",
                        }}
                      >
                        আপনার কার্ট খালি
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#999999",
                          marginBottom: "24px",
                        }}
                      >
                        কেনাকাটা শুরু করুন
                      </p>
                      <Link
                        to="/product-category"
                        onClick={() => setIsCartOpen(false)}
                        style={{
                          padding: "12px 24px",
                          backgroundColor: "#016737",
                          color: "#FFFFFF",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          fontFamily: "Hind Siliguri, sans-serif",
                          textDecoration: "none",
                          display: "inline-block",
                          transition: "all 0.2s ease",
                        }}
                        className="hover:opacity-90"
                      >
                        কেনাকাটা করুন
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item, index) => {
                        const discountedPrice = calculateDiscountedPrice(
                          item.price,
                          item.discount
                        );
                        const itemTotal = discountedPrice * item.quantity;

                        return (
                          <motion.div
                            key={item.productId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center border border-gray-300 gap-4 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <div className="relative flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-sm"
                              />
                              {item.discount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                                  {item.discount.toFixed(0)}% OFF
                                </span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                                {item.name}
                              </h3>

                              <div className="flex items-center mt-2">
                                <button
                                  onClick={() =>
                                    handleQuantityUpdate(
                                      item.productId,
                                      item.quantity - 1
                                    )
                                  }
                                  className="w-8 h-6 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  -
                                </button>
                                <span className="w-8 sm:w-10 text-center font-semibold text-gray-900 dark:text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityUpdate(
                                      item.productId,
                                      item.quantity + 1
                                    )
                                  }
                                  className="w-8 h-6 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>

                              <div className="mt-3 space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="text-base sm:text-lg font-bold textColor">
                                    Total:{" "}
                                    {formatPrice(
                                      itemTotal + 0.009999999999779296
                                    ).toFixed(0)}
                                    <span className="text-xl font-bold">৳</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.productId)}
                              className="p-2 max-[640px]:-mt-9 textColor hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              aria-label="Remove item"
                            >
                              <FaTrash className="w-5 h-5" />
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                  <div className="px-4 py-2 sm:p-6 border-t border-gray-400 bg-white dark:bg-gray-900">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        Subtotal:
                      </span>
                      <span className="text-2xl font-bold textColor">
                        {formatPrice(
                          calculateSubtotal() + 0.009999999999779296
                        ).toFixed(0)}
                        <span className="text-xl font-bold">৳</span>
                      </span>
                    </div>
                    <div className="space-y-3">
                      <Link to="/shopping-cart" className="block">
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="w-full py-2 px-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                        >
                          View Cart
                          <FaArrowRight />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleCheckout(user, navigate)}
                        className="w-full py-2 px-6 bgColor text-white rounded-lg hover:bgColor transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={cart.length === 0}
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                )}
                {/* Promo Code */}
                <div className="p-4 sm:p-6 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
                  <div className="flex items-center gap-4">
                    <button className="py-2 px-6 rounded-lg bg-transparent transition-colors"></button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className={`fixed top-0 left-0 z-40 w-full h-screen bg-black/50 backdrop-blur-sm 
                ${location.pathname === "/shopping-cart" && "hidden"}`}
            />
          </>
        )}
      </AnimatePresence>

      {/* Auth Modal
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        redirectTo="/checkout"
      /> */}
    </>
  );
};

export default SidebarCart;
