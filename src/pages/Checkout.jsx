import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaLock, FaMinus, FaPlus, FaMoneyBillWave } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axiosInstanace";
import ScrollToTop from "../components/ScrollToTop";
import { IndexContext } from "../context";
import Swal from "sweetalert2";
import useLocalStorage from "../hooks/useLocalStorage";
// Utility function to calculate discounted price
const calculateDiscountedPrice = (price, discount) => {
  if (!discount) return price;
  return price - (price * discount) / 100;
};

// Delivery charge constants
const DELIVERY_CHARGE = {
  DHAKA: 60,
  OUTSIDE_DHAKA: 110,
};

const districts = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barisal",
  "Bhola",
  "Bogra",
  "Brahmanbaria",
  "Chandpur",
  "Chittagong",
  "Chuadanga",
  "Comilla",
  "Cox's Bazar",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jessore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Nawabganj",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
];

const Checkout = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const [orderedData, setOrderedData] = useLocalStorage("orderedDataList", []);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(!user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    phone: "",
    district: "Dhaka",
    address: "",
    notes: "",
  });
  const { siteSettings } = useContext(IndexContext);
  const [shipping, setShipping] = useState(DELIVERY_CHARGE.DHAKA);

  // Update shipping cost when district changes
  useEffect(() => {
    setShipping(
      formData.district === "Dhaka"
        ? DELIVERY_CHARGE.DHAKA
        : DELIVERY_CHARGE.OUTSIDE_DHAKA
    );
  }, [formData.district]);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const discountedPrice = calculateDiscountedPrice(
        item.price,
        item.discount
      );
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + shipping;

  const formatPrice = (price) => {
    return price.toFixed(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি এটি পুনরুদ্ধার করতে পারবেন না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, এটি সরানো হয়েছে!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(productId);
        Swal.fire({
          text: "আইটেমটি কার্ট থেকে সরানো হয়েছে!",
          icon: "success",
        });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!user) {
    //   setShowAuthModal(true);
    //   return;
    // }

    // Validate form data
    if (!formData.name) {
      toast.error("অনুগ্রহ করে সবগুলো প্রয়োজনীয় ফিল্ড পূরণ করুন।");
      return;
    }
    if (!formData.phone.match(/^[0-9]{11}$/)) {
      toast.error("অনুগ্রহ করে একটি বৈধ মোবাইল নম্বর লিখুন।");
      return;
    }
    if (!formData.address) {
      toast.error("অনুগ্রহ করে ঠিকানা লিখুন।");
      return;
    }

    if (!districts.includes(formData.district)) {
      toast.error("অনুগ্রহ করে একটি বৈধ জেলা সিলেক্ট করুন।");
      return;
    }
    if (formData.phone.length < 11) {
      toast.error("অনুগ্রহ করে একটি বৈধ মোবাইল নম্বর লিখুন।");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        ...formData,
        total,
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: calculateDiscountedPrice(item.price, item.discount),
          originalPrice: item.price,
          discount: item.discount,
          quantity: item.quantity,
          image: item.image,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
        })),
        userId: user?.uid,
        status: "pending",
        paymentMethod: "Cash on delivery",
        orderDate: new Date(),
      };
      Swal.fire({
        title: "আপনি কি নিশ্চিত?",
        text: "আপনি কি এই অর্ডারটি নিশ্চিত করতে চান?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "হ্যাঁ, নিশ্চিত করুন!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // লোডার দেখানো হচ্ছে
          Swal.fire({
            title: "অর্ডার প্রসেস হচ্ছে...",
            text: "অনুগ্রহ করে অপেক্ষা করুন",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          try {
            const response = await axiosInstance.post("/order", orderData);
            const orderId =
              response.data?._id || response.data?.id || response.data?.orderId;

            if (response.status === 201 && response.data.id) {
              localStorage.setItem("ChecklastOrderId", response.data.id);

              if (!user) {
                setOrderedData((prevData) => [
                  ...prevData,
                  {
                    orderId,
                    orderDate: new Date(),
                    paymentMethod: "Cash on delivery",
                    total,
                    items: cart.map((item) => ({
                      productId: item.productId,
                      name: item.name,
                      price: calculateDiscountedPrice(
                        item.price,
                        item.discount
                      ),
                      originalPrice: item.price,
                      discount: item.discount,
                      quantity: item.quantity,
                      image: item.image,
                      selectedColor: item.selectedColor,
                      selectedSize: item.selectedSize,
                    })),
                  },
                ]);
              }

              cart.forEach((item) => removeFromCart(item.productId));

              Swal.close(); // লোডার বন্ধ করা
              toast.success("অর্ডার সফলভাবে দেওয়া হয়েছে!");

              setTimeout(() => {
                navigate("/order-confirmation");
              }, 800);
            } else {
              throw new Error("অকার্যকর অর্ডার রেসপন্স");
            }
          } catch (error) {
            Swal.close(); // লোডার বন্ধ করা
            toast.error("অর্ডার দিতে ব্যর্থ, আবার চেষ্টা করুন।");
            console.error(error);
          }
        }
      });
    } catch (error) {
      console.error("অর্ডার দিতে ব্যর্থ, আবার চেষ্টা করুন।", error);
      toast.error(
        error.response?.data?.message || "অর্ডার দিতে ব্যর্থ, আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  };

  // if (cart.length === 0) {
  //   navigate('/shopping-cart');
  //   return null;
  // }

  return (
    <div
      style={{ backgroundColor: "var(--color-bg-main)", minHeight: "100vh" }}
    >
      <ScrollToTop />
      <div
        className="container-minimal"
        style={{
          paddingTop: "var(--space-2xl)",
          paddingBottom: "var(--space-2xl)",
        }}
      >
        {/* Order Progress Stepper - Mobile Optimized */}
        <div className="mb-8 max-[640px]:mb-6">
          <div className="flex items-center justify-between max-w-md mx-auto px-4">
            {/* Step 1 - Cart */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-10 h-10 max-[640px]:w-9 max-[640px]:h-9 rounded-full flex items-center justify-center font-bold shadow-md"
                style={{
                  backgroundColor: "#016737",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                1
              </div>
              <span
                className="text-xs font-semibold text-center"
                style={{
                  color: "#016737",
                  fontFamily: "Hind Siliguri, sans-serif",
                }}
              >
                কার্ট
              </span>
            </div>

            {/* Connector Line 1 */}
            <div
              className="flex-1 h-1 max-[640px]:h-0.5 mx-2"
              style={{
                backgroundColor: "#016737",
                maxWidth: "60px",
              }}
            ></div>

            {/* Step 2 - Checkout */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-10 h-10 max-[640px]:w-9 max-[640px]:h-9 rounded-full flex items-center justify-center font-bold shadow-md"
                style={{
                  backgroundColor: "#016737",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                2
              </div>
              <span
                className="text-xs font-semibold text-center"
                style={{
                  color: "#016737",
                  fontFamily: "Hind Siliguri, sans-serif",
                }}
              >
                চেকআউট
              </span>
            </div>

            {/* Connector Line 2 */}
            <div
              className="flex-1 h-1 max-[640px]:h-0.5 mx-2"
              style={{
                backgroundColor: "#E5E7EB",
                maxWidth: "60px",
              }}
            ></div>

            {/* Step 3 - Confirmation */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-10 h-10 max-[640px]:w-9 max-[640px]:h-9 rounded-full flex items-center justify-center font-bold"
                style={{
                  backgroundColor: "#F3F4F6",
                  color: "#9CA3AF",
                  fontSize: "14px",
                  border: "2px solid #E5E7EB",
                }}
              >
                3
              </div>
              <span
                className="text-xs font-semibold text-center"
                style={{
                  color: "#9CA3AF",
                  fontFamily: "Hind Siliguri, sans-serif",
                }}
              >
                নিশ্চিতকরণ
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Summary Card */}
        <div className="lg:hidden mb-6">
          <div className="card-minimal p-5">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="heading-3 bangla"
                style={{ color: "var(--color-text-primary)" }}
              >
                অর্ডার সারাংশ
              </h3>
              <span
                className="badge-minimal"
                style={{
                  backgroundColor: "var(--color-bg-soft)",
                  color: "var(--color-text-secondary)",
                  padding: "4px 12px",
                }}
              >
                {cart.length} আইটেম
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span
                className="text-small bangla-text"
                style={{ color: "var(--color-text-secondary)" }}
              >
                মোট
              </span>
              <span
                className="price-text"
                style={{ color: "var(--color-primary)", fontSize: "24px" }}
              >
                ৳{formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing Details - Ultra Minimal */}
          <div>
            <h2
              className="heading-2 bangla mb-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              বিলিং তথ্য
            </h2>

            {/* Login Info Card */}
            {!user && (
              <div
                className="card-minimal p-4 mb-6"
                style={{
                  backgroundColor: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                }}
              >
                <p
                  className="text-small bangla-text mb-2"
                  style={{ color: "#1E40AF", fontWeight: "500" }}
                >
                  অ্যাকাউন্ট নেই? সমস্যা নেই
                </p>
                <p
                  className="text-small bangla-text"
                  style={{ color: "#3B82F6" }}
                >
                  তবে অ্যাকাউন্ট করলে অর্ডার ট্র্যাকিংসহ আরও সুবিধা পাবেন!
                  <a
                    href="/login"
                    className="ml-1 font-medium hover:underline"
                    style={{ color: "var(--color-primary)" }}
                  >
                    লগইন করুন
                  </a>
                </p>
              </div>
            )}

            {/* Billing Form - Ultra Minimal */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    className="block text-small font-medium bangla-text mb-2"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    আপনার নাম{" "}
                    <span style={{ color: "var(--color-primary)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="আপনার নাম লিখুন"
                    className="input-minimal w-full"
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-small font-medium bangla-text mb-2"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    মোবাইল নাম্বার{" "}
                    <span style={{ color: "var(--color-primary)" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="১১ ডিজিটের নাম্বারটি লিখুন"
                    className="input-minimal w-full"
                    required
                    pattern="[0-9]{11}"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-small font-medium bangla-text mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  জেলা সিলেক্ট করুন{" "}
                  <span style={{ color: "var(--color-primary)" }}>*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="input-minimal w-full"
                  required
                >
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-small font-medium bangla-text mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  সম্পূর্ণ ঠিকানা{" "}
                  <span style={{ color: "var(--color-primary)" }}>*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="রোড নাম/নং, বাড়ি নাম/নং, ফ্ল্যাট নাম্বার..."
                  className="input-minimal w-full"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-small font-medium bangla-text mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  নির্দেশনা (ঐচ্ছিক)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="আপনার স্পেশাল কোন নির্দেশনা থাকলে এখানে লিখুন"
                  className="input-minimal w-full"
                  rows="3"
                />
              </div>
            </form>
          </div>

          {/* Order Details - Ultra Minimal */}
          <div id="cartDetails">
            <h2
              className="heading-2 bangla mb-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              অর্ডার বিবরণ
            </h2>

            {/* Cart Items - Ultra Minimal */}
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.productId} className="card-minimal p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div
                      className="relative w-20 h-20 flex-shrink-0 overflow-hidden"
                      style={{
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--color-bg-soft)",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {item.discount > 0 && (
                        <div
                          className="badge-minimal absolute top-1 right-1"
                          style={{
                            backgroundColor: "var(--color-primary)",
                            color: "white",
                            padding: "2px 6px",
                            fontSize: "10px",
                          }}
                        >
                          -{item.discount}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="heading-3 bangla mb-2 truncate"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {item.name}
                      </h3>

                      {/* Variants */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.selectedColor && (
                          <span
                            className="badge-minimal"
                            style={{
                              backgroundColor: "var(--color-bg-soft)",
                              color: "var(--color-text-secondary)",
                              padding: "2px 8px",
                              fontSize: "11px",
                            }}
                          >
                            {item.selectedColor}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span
                            className="badge-minimal"
                            style={{
                              backgroundColor: "var(--color-bg-soft)",
                              color: "var(--color-text-secondary)",
                              padding: "2px 8px",
                              fontSize: "11px",
                            }}
                          >
                            {item.selectedSize}
                          </span>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center rounded-lg overflow-hidden"
                          style={{ border: "1px solid var(--color-border)" }}
                        >
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            className="px-2 py-1 transition-colors"
                            style={{
                              backgroundColor: "var(--color-bg-soft)",
                              color: "var(--color-text-primary)",
                            }}
                          >
                            <FaMinus className="w-3 h-3" />
                          </button>
                          <span
                            className="px-3 py-1 text-small font-medium"
                            style={{
                              color: "var(--color-text-primary)",
                              minWidth: "40px",
                              textAlign: "center",
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            className="px-2 py-1 transition-colors"
                            style={{
                              backgroundColor: "var(--color-bg-soft)",
                              color: "var(--color-text-primary)",
                            }}
                          >
                            <FaPlus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p
                            className="price-text"
                            style={{
                              color: "var(--color-primary)",
                              fontSize: "18px",
                            }}
                          >
                            ৳
                            {formatPrice(
                              calculateDiscountedPrice(
                                item.price,
                                item.discount
                              ) * item.quantity
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Ultra Minimal */}
            <div className="card-minimal p-5 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span
                  className="text-small bangla-text"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  সাবটোটাল
                </span>
                <span
                  className="body-text font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  ৳{formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <span
                    className="text-small bangla-text"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    ডেলিভারি
                  </span>
                  <p
                    className="text-xs bangla-text"
                    style={{
                      color: "var(--color-text-muted)",
                      marginTop: "2px",
                    }}
                  >
                    (
                    {formData.district === "Dhaka"
                      ? "ঢাকার ভিতরে"
                      : "ঢাকার বাহিরে"}
                    )
                  </p>
                </div>
                <span
                  className="body-text font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  ৳{shipping}
                </span>
              </div>

              <div
                className="pt-4"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                <div className="flex justify-between items-center">
                  <span
                    className="heading-3 bangla"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    মোট
                  </span>
                  <span
                    className="price-text"
                    style={{
                      color: "var(--color-primary)",
                      fontSize: "24px",
                    }}
                  >
                    ৳{formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Section - Ultra Minimal */}
            <div
              className="card-minimal p-5 mb-6"
              style={{
                backgroundColor: "#F0FDF4",
                border: "1px solid #86EFAC",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <FaMoneyBillWave
                  className="w-5 h-5"
                  style={{ color: "#16A34A" }}
                />
                <h3 className="heading-3 bangla" style={{ color: "#166534" }}>
                  ক্যাশ অন ডেলিভারি
                </h3>
              </div>
              <ul className="space-y-2">
                <li
                  className="flex items-start gap-2 text-small bangla-text"
                  style={{ color: "#166534" }}
                >
                  <span>✓</span>
                  <span>আমরা প্রতিশ্রুতিবদ্ধ সততা ও বিশ্বস্ততায়</span>
                </li>
                <li
                  className="flex items-start gap-2 text-small bangla-text"
                  style={{ color: "#166534" }}
                >
                  <span>✓</span>
                  <span>আগে প্রোডাক্ট যাচাই করুন, তারপর পেমেন্ট করুন</span>
                </li>
                <li
                  className="flex items-start gap-2 text-small bangla-text"
                  style={{ color: "#166534" }}
                >
                  <span>⚠️</span>
                  <span>অযৌক্তিক রিটার্নের ক্ষেত্রে গ্রাহক দায়বদ্ধ থাকবেন</span>
                </li>
              </ul>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-minimal btn-primary w-full py-4 bangla-text btn-text transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>প্রসেস হচ্ছে...</span>
                </>
              ) : (
                <>
                  <FaLock />
                  অর্ডার কনফার্ম করুন
                </>
              )}
            </button>

            <p
              className="text-xs text-center bangla-text mt-4"
              style={{ color: "var(--color-text-muted)" }}
            >
              অর্ডার কনফার্ম করে আপনি আমাদের{" "}
              <a
                href="/privacy-policy"
                className="hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                শর্তাবলী
              </a>{" "}
              এবং{" "}
              <a
                href="/privacy-policy"
                className="hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                গোপনীয়তা নীতি
              </a>{" "}
              সম্মত হন
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
