import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  AiOutlineClose,
  AiOutlineShoppingCart,
  AiOutlineStar,
  AiOutlineTags,
} from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { RiArrowRightSFill } from "react-icons/ri";
import { axiosInstance } from "../../lib/axiosInstanace";
import { IndexContext } from "../../context";
import { toast } from "react-hot-toast";
import {
  setCategoryFilter,
  setPriceFilter,
  clearFilters,
  fetchProducts,
} from "../../redux/features/products/productSlice";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const { setProductId } = useContext(IndexContext);
  const { products, loading, activeFilters } = useSelector(
    (store) => store.products
  );
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const categoryLocation = location.pathname.split("/")[2];
  const params = useParams();
  const categorybyfetch = params.category;

  useEffect(() => {
    dispatch(fetchProducts(categorybyfetch));
  }, [categorybyfetch, dispatch]);

  useEffect(() => {
    if (products?.length > 0) {
      const maxPrice = Math.max(
        ...products.map((product) => {
          const discountedPrice =
            product.price - (product.price * (product.discount || 0)) / 100;
          return discountedPrice;
        })
      );
      setPriceRange([0, Math.ceil(maxPrice)]);
    }
  }, [products]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance("/category");
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handlePriceFilter = () => {
    if (!products?.length) {
      toast.error("No products available to filter");
      return;
    }

    // Apply price filter
    dispatch(setPriceFilter(priceRange));

    // Show success message with count
    const filteredCount = products.filter((product) => {
      const discountedPrice =
        product.price - (product.price * (product.discount || 0)) / 100;
      return (
        discountedPrice >= priceRange[0] && discountedPrice <= priceRange[1]
      );
    }).length;

    if (filteredCount === 0) {
      toast.info("No products found in this price range");
    } else {
      toast.success(
        `Found ${filteredCount} products in price range ৳${priceRange[0]} - ৳${priceRange[1]}`
      );
    }
  };

  const clearPriceFilter = () => {
    if (products?.length) {
      const maxPrice = Math.max(
        ...products.map((product) => {
          const discountedPrice =
            product.price - (product.price * (product.discount || 0)) / 100;
          return discountedPrice;
        })
      );
      setPriceRange([0, Math.ceil(maxPrice)]);
      dispatch(clearFilters());
      toast.success("Filters cleared");
    }
  };

  const handleCategoryClick = (category) => {
    dispatch(fetchProducts(category));
  };

  return (
    <>
      <div className="max-lg:hidden">
        <div style={{ width: "280px", flexShrink: 0 }}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #F0F0F0",
              borderRadius: "16px",
              padding: "24px",
              position: "sticky",
              top: "100px",
            }}
          >
            {/* Price Filter Section - Ultra Modern */}
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    fontFamily: "Hind Siliguri, sans-serif",
                    color: "#1A1A1A",
                  }}
                >
                  মূল্য পরিসীমা
                </h3>
                <button
                  onClick={clearPriceFilter}
                  style={{
                    fontSize: "13px",
                    color: "#666666",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Hind Siliguri, sans-serif",
                  }}
                  className="hover:opacity-70"
                >
                  রিসেট
                </button>
              </div>
              <div style={{ padding: "8px 4px 16px" }}>
                <Slider
                  range
                  min={0}
                  max={10000}
                  value={priceRange}
                  onChange={handlePriceChange}
                  trackStyle={[{ backgroundColor: "#016737", height: 4 }]}
                  handleStyle={[
                    {
                      backgroundColor: "#FFFFFF",
                      border: "3px solid #016737",
                      width: 16,
                      height: 16,
                      marginTop: -6,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    },
                    {
                      backgroundColor: "#FFFFFF",
                      border: "3px solid #016737",
                      width: 16,
                      height: 16,
                      marginTop: -6,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    },
                  ]}
                  railStyle={{ backgroundColor: "#E8E8E8", height: 4 }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#666666",
                  }}
                >
                  ৳{priceRange[0].toLocaleString()} - ৳
                  {priceRange[1].toLocaleString()}
                </div>
                <button
                  onClick={handlePriceFilter}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: "#016737",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "Hind Siliguri, sans-serif",
                    transition: "all 0.2s ease",
                  }}
                  className="hover:opacity-90"
                >
                  প্রয়োগ করুন
                </button>
              </div>
            </div>

            {/* Categories Section - Ultra Modern */}
            <div style={{ marginBottom: "32px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  fontFamily: "Hind Siliguri, sans-serif",
                  color: "#1A1A1A",
                  marginBottom: "16px",
                }}
              >
                ক্যাটাগরি
              </h3>
              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: "40px",
                        backgroundColor: "#F5F5F5",
                        borderRadius: "8px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: "-100%",
                          height: "100%",
                          width: "100%",
                          background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                          animation: "shimmer 1.5s infinite",
                        }}
                      />
                    </div>
                  ))}
                  <style>
                    {`
                      @keyframes shimmer {
                        0% { left: -100%; }
                        100% { left: 100%; }
                      }
                    `}
                  </style>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {categories?.map((category, index) => (
                    <Link
                      to={`/product-category/${category.category
                        .split(" ")
                        .join("-")}`}
                      key={index}
                      onClick={() => {
                        setIsCategoriesOpen((prev) =>
                          prev === index ? null : index
                        );
                        handleCategoryClick(category.category);
                      }}
                      style={{
                        padding: "12px 16px",
                        backgroundColor:
                          categoryLocation ===
                          category.category.split(" ").join("-")
                            ? "#F0F9F5"
                            : "transparent",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        fontFamily: "Hind Siliguri, sans-serif",
                        color:
                          categoryLocation ===
                          category.category.split(" ").join("-")
                            ? "#016737"
                            : "#666666",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                        display: "block",
                      }}
                      className="hover:opacity-70"
                    >
                      {category.category}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Trending Products Section */}
            <div className="mt-10">
              <p className="text-black text-start text-xl md:hidden lg:block sm:hidden">
                Trending Products
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4 mt-8 md:hidden lg:block">
              {products?.slice(3, 7).map((product) => (
                <div
                  onClick={() => setProductId(product._id)}
                  key={product._id}
                >
                  <Link
                    to={`/products/${product.slug}`}
                    className="flex items-center cursor-pointer active:scale-90 duration-300 border rounded-md p-3 shadow-sm bg-white"
                  >
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h2 className="text-sm font-semibold text-start text-gray-800">
                        {product.name}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl font-semibold textColor">
                          {(
                            product.price -
                            (product.price * (product.discount || 0)) / 100
                          ).toFixed(0)}
                          <span className="text-2xl font-bold">৳</span>
                        </span>
                        {product.discount > 0 && (
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            {product.price.toFixed(0)}
                            <span className="text-2xl font-bold">৳</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
