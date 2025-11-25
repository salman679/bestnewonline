import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { FaSearch, FaArrowUp, FaArrowDown, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, clearSearch } from "../features/products/searchSlice";
import { Link, useNavigate } from "react-router-dom";
import { IndexContext } from "../context";
import { motion, AnimatePresence } from "framer-motion";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchProducts, isLoading, isError, error } = useSelector(
    (state) => state.search
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debouncedSearch = useCallback(
    (term) => {
      if (term.trim()) {
        dispatch(getProducts(term));
        setShowDropdown(true);
        setSelectedIndex(-1);
      } else {
        dispatch(clearSearch());
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch]);

  const handleProductClick = useCallback(
    (slug) => {
      setShowDropdown(false);
      setSelectedIndex(-1);
      setSearchTerm("");
      navigate(`/products/${slug}`);
    },
    [navigate]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!showDropdown || !searchProducts?.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchProducts.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : searchProducts.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleProductClick(searchProducts[selectedIndex].slug);
          } else if (searchProducts.length > 0) {
            handleProductClick(searchProducts[0].slug);
          }
          break;
        case "Escape":
          setShowDropdown(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
        default:
          break;
      }
    },
    [showDropdown, searchProducts, selectedIndex, handleProductClick]
  );

  const handleSearchClick = useCallback(() => {
    if (searchTerm.trim()) {
      if (searchProducts?.length > 0) {
        handleProductClick(searchProducts[0].slug);
      } else {
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        setShowDropdown(false);
        setSearchTerm("");
      }
    }
  }, [searchTerm, searchProducts, handleProductClick, navigate]);

  const formatPrice = useCallback((price) => {
    return price?.toLocaleString("en-BD") || "0";
  }, []);

  const clearSearchInput = () => {
    setSearchTerm("");
    dispatch(clearSearch());
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div
      className="relative w-full max-w-2xl max-[1024px]:hidden"
      ref={dropdownRef}
    >
      {/* Ultra Modern Search Input */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#FAFAFA",
          border: "1px solid #E8E8E8",
          borderRadius: "12px",
          transition: "all 0.2s ease",
        }}
        className="group"
      >
        <div
          style={{
            position: "absolute",
            left: "16px",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <FaSearch
            style={{
              width: "18px",
              height: "18px",
              color: "#999999",
              transition: "color 0.2s ease",
            }}
            className="group-focus-within:text-[#016737]"
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="পণ্য খুঁজুন..."
          style={{
            width: "100%",
            padding: "14px 140px 14px 48px",
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            fontSize: "14px",
            fontFamily: "Hind Siliguri, sans-serif",
            color: "#1A1A1A",
          }}
          className="placeholder:text-[#999999]"
        />
        <div
          style={{
            position: "absolute",
            right: "6px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {searchTerm && (
            <button
              onClick={clearSearchInput}
              style={{
                padding: "8px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#999999",
                transition: "color 0.2s ease",
              }}
              className="hover:text-[#666666]"
              aria-label="Clear search"
            >
              <FaTimes style={{ width: "16px", height: "16px" }} />
            </button>
          )}
          <button
            onClick={handleSearchClick}
            style={{
              padding: "10px 24px",
              backgroundColor: "#016737",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              fontFamily: "Hind Siliguri, sans-serif",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            className="hover:opacity-90"
          >
            খুঁজুন
          </button>
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              zIndex: 1000,
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #F0F0F0",
              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)",
              overflow: "hidden",
            }}
          >
            {isLoading ? (
              <div style={{ padding: "32px", textAlign: "center" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid #F0F0F0",
                    borderTop: "3px solid #016737",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    margin: "0 auto",
                  }}
                />
                <p
                  style={{
                    marginTop: "12px",
                    fontSize: "14px",
                    color: "#999999",
                    fontFamily: "Hind Siliguri, sans-serif",
                  }}
                >
                  খুঁজছি...
                </p>
              </div>
            ) : isError ? (
              <div style={{ padding: "24px", textAlign: "center" }}>
                <p style={{ color: "#DC2626", fontSize: "14px" }}>
                  {error || "পণ্য খুঁজতে সমস্যা হয়েছে"}
                </p>
              </div>
            ) : searchProducts?.length > 0 ? (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1px",
                    backgroundColor: "#F5F5F5",
                  }}
                >
                  {searchProducts.slice(0, 6).map((product, index) => (
                    <Link
                      to={`/products/${product.slug}`}
                      key={product._id}
                      onClick={() => handleProductClick(product.slug)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "16px",
                        backgroundColor:
                          index === selectedIndex ? "#F0F9F5" : "#FFFFFF",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        textDecoration: "none",
                      }}
                      className="hover:bg-[#FAFAFA]"
                    >
                      {/* Product Image */}
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          flexShrink: 0,
                          backgroundColor: "#F5F5F5",
                          borderRadius: "8px",
                          padding: "8px",
                        }}
                      >
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div
                        style={{
                          marginLeft: "12px",
                          flex: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              fontFamily: "Hind Siliguri, sans-serif",
                              color: "#1A1A1A",
                              marginBottom: "4px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.name}
                          </h3>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#999999",
                              fontFamily: "Hind Siliguri, sans-serif",
                            }}
                          >
                            {product.category}
                          </p>
                        </div>
                        <div style={{ textAlign: "right", marginLeft: "12px" }}>
                          {product.discount > 0 && (
                            <p
                              style={{
                                fontSize: "12px",
                                color: "#999999",
                                textDecoration: "line-through",
                                marginBottom: "2px",
                              }}
                            >
                              ৳{formatPrice(product.originalPrice)}
                            </p>
                          )}
                          <p
                            style={{
                              fontSize: "16px",
                              fontWeight: "700",
                              color: "#016737",
                              fontFamily: "Inter, sans-serif",
                            }}
                          >
                            ৳{formatPrice(product.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#FAFAFA",
                    borderTop: "1px solid #F0F0F0",
                  }}
                >
                  <button
                    onClick={() => {
                      navigate("/product-category");
                      setShowDropdown(false);
                      setSearchTerm("");
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      backgroundColor: "#016737",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      fontFamily: "Hind Siliguri, sans-serif",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                    className="hover:opacity-90"
                  >
                    <span>সকল ফলাফল দেখুন</span>
                    <svg
                      style={{ width: "16px", height: "16px" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : searchTerm ? (
              <div
                style={{
                  padding: "32px",
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#999999",
                  fontFamily: "Hind Siliguri, sans-serif",
                }}
              >
                কোনো পণ্য পাওয়া যায়নি
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
