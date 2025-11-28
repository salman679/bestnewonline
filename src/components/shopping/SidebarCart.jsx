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
              <div className="h-screen flex flex-col">
                {/* Header - Ultra Modern */}
                <div className="p-6 border-b border-[#F0F0F0] bg-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <FaShoppingCart className="text-2xl text-primary" />
                        {cart.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-primary text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {cart.length}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold font-bangla text-[#1A1A1A]">
                        কার্ট
                      </h2>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="p-2 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#F5F5F5]"
                      aria-label="Close cart"
                    >
                      <FaTimes className="text-xl text-[#666666]" />
                    </button>
                  </div>
                  <p className="text-[13px] text-[#999999] mt-2 font-bangla">
                    {cart.length}টি পণ্য
                  </p>
                </div>

                {/* Product List - Modern Scroll */}
                <div className="flex-1 overflow-y-auto p-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-12">
                      <FaBoxOpen className="text-6xl text-[#E0E0E0] mb-4" />
                      <p className="text-base font-medium text-[#666666] font-bangla mb-2">
                        আপনার কার্ট খালি
                      </p>
                      <p className="text-sm text-[#999999] mb-6">
                        কেনাকাটা শুরু করুন
                      </p>
                      <Link
                        to="/product-category"
                        onClick={() => setIsCartOpen(false)}
                        className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-semibold font-bangla no-underline inline-block transition-all duration-200 hover:opacity-90"
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
                            <div className="relative shrink-0">
                              <img
                                src={
                                  item.image?.includes("ik.imagekit.io")
                                    ? `${item.image}?tr=w-100,h-100,f-webp,q-80`
                                    : item.image
                                }
                                alt={item.name}
                                width={96}
                                height={96}
                                loading="lazy"
                                decoding="async"
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
                                  <div className="text-base sm:text-lg font-bold text-primary">
                                    Total: {Math.round(itemTotal).toFixed(0)}
                                    <span className="text-xl font-bold">৳</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.productId)}
                              className="p-2 max-[640px]:-mt-9 text-primary hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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
                      <span className="text-2xl font-bold text-primary">
                        {Math.round(calculateSubtotal()).toFixed(0)}
                        <span className="text-xl font-bold">৳</span>
                      </span>
                    </div>
                    <div className="space-y-3">
                      <Link to="/shopping-cart" className="block">
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="btn-minimal btn-outline w-full font-bangla gap-2"
                        >
                          কার্ট দেখুন
                          <FaArrowRight />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleCheckout(user, navigate)}
                        className="btn-minimal btn-primary w-full font-bangla gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={cart.length === 0}
                      >
                        চেকআউট করুন
                      </button>
                    </div>
                  </div>
                )}
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
    </>
  );
};

export default SidebarCart;
