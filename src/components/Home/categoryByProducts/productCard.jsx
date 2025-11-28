import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { IndexContext } from "../../../context";
import { HiHeart } from "react-icons/hi2";
import { WishlistContext } from "../../../context/WishlistContext";
import { CartContext } from "../../../context/CartContext";

const ProductCard = ({ product }) => {
  const { setProductId } = useContext(IndexContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  if (!product) {
    return null;
  }

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link
      to={`/products/${product.name}`}
      onClick={() => setProductId(product._id)}
      className="block group"
    >
      <div className="card-minimal shadow-minimal-hover group transition-all duration-300 relative">
        {/* Image Container - Ultra Minimal */}
        <div
          className="relative overflow-hidden aspect-square"
          style={{
            backgroundColor: "var(--color-bg-soft)",
            borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
          }}
        >
          <Link to={`/products/${product.slug}`} className="block">
            <img
              src={
                product.image?.[0]?.includes("ik.imagekit.io")
                  ? `${product.image[0]}?tr=w-300,h-300,f-webp,q-80`
                  : product.image?.[0]
              }
              alt={product.name}
              width={300}
              height={300}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Minimal Discount Badge */}
          {product.discount > 0 && (
            <div
              className="badge-minimal absolute top-3 left-3"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "white",
                fontSize: "11px",
                padding: "4px 10px",
              }}
            >
              -{product.discount.toFixed(0)}%
            </div>
          )}

          {/* Minimal Wishlist Button */}
          <button
            onClick={(e) => handleToggleWishlist(e, product)}
            className="absolute top-3 right-3 bg-white p-2 shadow-minimal hover:shadow-lg rounded-full transition-all duration-300 z-10"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <HiHeart
              className={`w-5 h-5 max-[640px]:w-4 max-[640px]:h-4 transition-colors`}
              style={{
                color: isInWishlist(product._id)
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              }}
            />
          </button>

          {/* Out of Stock Overlay */}
          {product.quantity === 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
            >
              <span
                className="body-text bangla"
                style={{ color: "var(--color-text-secondary)" }}
              >
                স্টক নেই
              </span>
            </div>
          )}
        </div>

        {/* Product Info - Ultra Minimal */}
        <div className="p-4 max-[640px]:p-3">
          <Link to={`/products/${product.slug}`}>
            <h3
              className="heading-3 mb-2 line-clamp-2 group-hover:opacity-70 transition-opacity"
              style={{ color: "var(--color-text-primary)", fontSize: "16px" }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Price Section - Minimal */}
          <div className="flex items-baseline gap-2 mb-3">
            <span
              className="price-text"
              style={{ color: "var(--color-primary)" }}
            >
              ৳
              {(
                product.price -
                (product.price * (product.discount || 0)) / 100
              ).toFixed(0)}
            </span>
            {product.discount > 0 && (
              <span
                className="text-small line-through"
                style={{ color: "var(--color-text-muted)" }}
              >
                ৳{product.price.toFixed(0)}
              </span>
            )}
          </div>

          {/* Stock Badge - Minimal */}
          {product.quantity > 0 && product.quantity < 10 && (
            <div className="mb-3">
              <span
                className="badge-minimal"
                style={{
                  backgroundColor: "var(--color-bg-light)",
                  color: "var(--color-text-secondary)",
                  fontSize: "11px",
                }}
              >
                মাত্র {product.quantity}টি বাকি
              </span>
            </div>
          )}

          {/* Add to Cart Button - Minimal */}
          <Link
            to={`/products/${product.slug}`}
            className="btn-minimal btn-outline w-full text-center btn-text bangla"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 16px",
              fontSize: "14px",
              minHeight: "40px",
              backgroundColor: "transparent",
              color: "#111827",
              borderRadius: "9999px",
              border: "1px solid #e5e7eb",
              fontWeight: "600",
              textDecoration: "none",
              width: "100%",
            }}
          >
            বিস্তারিত দেখুন
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
