import { HiHeart } from "react-icons/hi2";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineAppstore,
  AiOutlineBars,
  AiOutlineProduct,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { IoMdGrid } from "react-icons/io";
import ProductCart from "./ProductCart";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { fetchProducts } from "../../redux/features/products/productSlice";

const RightSidebar = () => {
  const [gridCols, setGridCols] = useState(4);
  const [sortOption, setSortOption] = useState("default");
  const { filteredProducts, loading } = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const category = location.pathname.split("/").pop();

  // Reset page when filtered products change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  const handleBrowseAllProducts = useCallback(() => {
    dispatch(fetchProducts()); // Fetch all products without category
    navigate("/product-category");
  }, [dispatch, navigate]);

  const getSortedProducts = () => {
    if (!filteredProducts) return [];

    const sorted = [...filteredProducts];
    switch (sortOption) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "price-asc":
        return sorted.sort((a, b) => {
          const priceA = a.price - (a.price * (a.discount || 0)) / 100;
          const priceB = b.price - (b.price * (b.discount || 0)) / 100;
          return priceA - priceB;
        });
      case "price-desc":
        return sorted.sort((a, b) => {
          const priceA = a.price - (a.price * (a.discount || 0)) / 100;
          const priceB = b.price - (b.price * (b.discount || 0)) / 100;
          return priceB - priceA;
        });
      default:
        return sorted;
    }
  };

  // Pagination
  const itemsPerPage = gridCols === 4 ? 12 : 9;
  const sortedProducts = getSortedProducts();
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentItems = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGridChange = (cols) => {
    setGridCols(cols);
    setCurrentPage(1); // Reset to first page when changing grid
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1); // Reset to first page when changing sort
  };

  return (
    <div style={{ flex: 1 }}>
      <div>
        {/* Top Section - Ultra Modern */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            padding: "0",
          }}
          className="flex-col md:flex-row gap-4 md:gap-0"
        >
          {/* Breadcrumb & Count */}
          <div className="max-[640px]:hidden">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
                color: "#666666",
                fontFamily: "Hind Siliguri, sans-serif",
              }}
            >
              <Link
                to={"/"}
                style={{
                  color: "#666666",
                  textDecoration: "none",
                }}
                className="hover:opacity-70"
              >
                হোম
              </Link>
              <span style={{ margin: "0 8px", color: "#CCCCCC" }}>/</span>
              <span style={{ color: "#1A1A1A", fontWeight: "500" }}>
                {category === "product-category"
                  ? "সকল পণ্য"
                  : category === ""
                  ? "সকল পণ্য"
                  : decodeURIComponent(category.split("-").join(" "))}
              </span>
              <span
                style={{
                  marginLeft: "8px",
                  color: "#999999",
                  fontSize: "13px",
                }}
              >
                ({sortedProducts.length})
              </span>
            </div>
          </div>

          {/* Controls */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "16px" }}
            className="w-full md:w-auto justify-between md:justify-end"
          >
            {/* Grid View Buttons */}
            <div className="hidden md:flex items-center" style={{ gap: "8px" }}>
              <button
                onClick={() => handleGridChange(2)}
                style={{
                  padding: "10px",
                  backgroundColor: gridCols === 2 ? "#F0F9F5" : "transparent",
                  color: gridCols === 2 ? "#016737" : "#999999",
                  border: "1px solid #E8E8E8",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                className="hover:opacity-70"
              >
                <AiOutlineBars style={{ width: "20px", height: "20px" }} />
              </button>
              <button
                onClick={() => handleGridChange(3)}
                style={{
                  padding: "10px",
                  backgroundColor: gridCols === 3 ? "#F0F9F5" : "transparent",
                  color: gridCols === 3 ? "#016737" : "#999999",
                  border: "1px solid #E8E8E8",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                className="hover:opacity-70"
              >
                <AiOutlineAppstore style={{ width: "20px", height: "20px" }} />
              </button>
              <button
                onClick={() => handleGridChange(4)}
                style={{
                  padding: "10px",
                  backgroundColor: gridCols === 4 ? "#F0F9F5" : "transparent",
                  color: gridCols === 4 ? "#016737" : "#999999",
                  border: "1px solid #E8E8E8",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                className="hover:opacity-70"
              >
                <IoMdGrid style={{ width: "20px", height: "20px" }} />
              </button>
            </div>

            {/* Sort Dropdown - Premium */}
            <div className="relative max-[640px]:hidden">
              <select
                value={sortOption}
                onChange={handleSortChange}
                style={{
                  appearance: "none",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E8E8E8",
                  borderRadius: "8px",
                  padding: "10px 40px 10px 16px",
                  fontSize: "14px",
                  fontFamily: "Hind Siliguri, sans-serif",
                  color: "#1A1A1A",
                  cursor: "pointer",
                  outline: "none",
                }}
                className="hover:opacity-70"
              >
                <option value="default">ডিফল্ট সর্টিং</option>
                <option value="name-asc">নাম (ক-য)</option>
                <option value="name-desc">নাম (য-ক)</option>
                <option value="price-asc">মূল্য (কম থেকে বেশি)</option>
                <option value="price-desc">মূল্য (বেশি থেকে কম)</option>
              </select>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "12px",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#666666",
                }}
              >
                <svg
                  style={{ width: "16px", height: "16px" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Mobile Sort & Filter */}
            <div className="flex w-full items-center min-[640px]:hidden justify-between space-x-6">
              <div>
                <p className="text-gray-700 min-[640px]:hidden md:flex items-center text-sm">
                  {category !== "" && (
                    <Link to={"/"} className="hover:text-gray-700 ">
                      Home
                    </Link>
                  )}

                  <span className="mx-2">/</span>
                  <span className="font-medium capitalize">
                    {category === "product-category"
                      ? "All"
                      : category === ""
                      ? "All"
                      : decodeURIComponent(category.split("-").join(" "))}
                  </span>
                  <span className="ml-2 hidden text-sm text-gray-500">
                    ({sortedProducts.length} items)
                  </span>
                </p>
              </div>
              <div className="relative min-[640px]:hidden">
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="default">Default sorting</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              gap: "16px",
            }}
          >
            {/* Modern Minimal Spinner */}
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "3px solid #F0F0F0",
                borderTop: "3px solid #016737",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p
              style={{
                fontSize: "14px",
                color: "#999999",
                fontFamily: "Hind Siliguri, sans-serif",
              }}
            >
              লোড হচ্ছে...
            </p>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <FaSearch className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              We couldn't find any products in this category. Try browsing other
              categories or check back later.
            </p>
            <button
              onClick={handleBrowseAllProducts}
              className="mt-6 px-6 py-2 bgColor text-white rounded-lg hover:bg-teal-600 transition-colors cursor-pointer"
            >
              Browse All Products
            </button>
          </div>
        ) : (
          <>
            <ProductCart gridCols={gridCols} currentItems={currentItems} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => changePage(page)}
                        className={`w-8 h-8 rounded-md text-sm ${
                          currentPage === page
                            ? "bgColor text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
