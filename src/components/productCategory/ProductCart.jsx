import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { HiHeart } from "react-icons/hi2";
import { AiFillStar } from "react-icons/ai";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { IndexContext } from "../../context";

const ProductCart = ({ gridCols, currentItems }) => {
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  if (!currentItems?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <img
          src="/no-results.svg"
          alt="No products found"
          className="w-64 h-64 mb-6"
        />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          We couldn't find any products matching your criteria. Try adjusting
          your filters or search terms.
        </p>
      </div>
    );
  }

  const getGridClass = () => {
    switch (gridCols) {
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default:
        return "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
  };

  return (
    <div className={`grid ${getGridClass()} gap-6 max-[640px]:gap-4`}>
      {currentItems.map((product) => (
        <Link
          to={`/products/${product.slug}`}
          key={product._id}
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #F0F0F0",
            borderRadius: "16px",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "block",
            textDecoration: "none",
            transform: "translateY(0)",
          }}
          className="group hover:shadow-lg"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              aspectRatio: "1/1",
            }}
          >
            <img
              src={product.image?.[0]}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
              className="group-hover:scale-110"
            />

            {/* Discount Badge - Modern Pill */}
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
                  padding: "6px 12px",
                  borderRadius: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                -{product.discount.toFixed(0)}%
              </div>
            )}

            {/* Wishlist Button - Floating */}
            <button
              onClick={(e) => handleToggleWishlist(e, product)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              className="hover:scale-110"
            >
              <HiHeart
                style={{
                  width: "20px",
                  height: "20px",
                  color: isInWishlist(product._id) ? "#DC2626" : "#999999",
                }}
              />
            </button>
          </div>

          <div style={{ padding: "16px" }}>
            {/* Product Title */}
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Hind Siliguri, sans-serif",
                color: "#1A1A1A",
                marginBottom: "8px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineHeight: "1.4",
                minHeight: "40px",
              }}
              className="group-hover:opacity-70"
            >
              {product.name}
            </h3>

            {/* Price Section */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "18px",
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

            {/* Stock Status */}
            <div
              style={{
                fontSize: "12px",
                fontWeight: "500",
                fontFamily: "Hind Siliguri, sans-serif",
                color: product.quantity > 0 ? "#10B981" : "#DC2626",
              }}
            >
              {product.quantity > 0
                ? `স্টকে আছে ${product.quantity}টি`
                : "স্টক নেই"}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductCart;
