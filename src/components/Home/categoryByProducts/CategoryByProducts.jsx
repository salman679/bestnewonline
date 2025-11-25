import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance } from "../../../lib/axiosInstanace";
import ProductCard from "./productCard";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../../../redux/features/products/productSlice";
import LoadingSpinner from "../../common/LoadingSpinner";

const CategoryByProducts = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const navigate = useNavigate();

  const clickToviewCategory = (category) => {
    dispatch(fetchProducts(category));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance("/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    dispatch(fetchProducts());
  }, [dispatch]);

  const categorybyproduct = categories.map((category) => category.category);

  // Filter products by selected category
  const getProductsByCategory = (category) => {
    return products.filter((product) => product.category === category);
  };

  return (
    <div className="section-spacing">
      {categorybyproduct.length == 0 ? (
        <div className="product-grid-minimal">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card-minimal animate-pulse overflow-hidden">
              <div
                className="aspect-square"
                style={{ backgroundColor: "var(--color-bg-light)" }}
              ></div>
              <div className="p-4 space-y-3">
                <div
                  className="h-4 rounded-full w-3/4"
                  style={{ backgroundColor: "var(--color-bg-light)" }}
                ></div>
                <div
                  className="h-4 rounded-full w-1/2"
                  style={{ backgroundColor: "var(--color-bg-light)" }}
                ></div>
                <div
                  className="h-10 rounded"
                  style={{ backgroundColor: "var(--color-bg-light)" }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        categorybyproduct.map((category, index) => (
          <div
            key={index}
            className="container mx-auto px-4 max-[640px]:px-2 mb-16 max-[640px]:mb-10 last:mb-0"
          >
            {/* Section Header - Ultra Minimal */}
            {getProductsByCategory(category).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-between mb-8 max-[640px]:mb-6"
              >
                <div>
                  <h2
                    className="heading-2 bangla"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {category}
                  </h2>
                  <div
                    style={{
                      height: "2px",
                      width: "48px",
                      backgroundColor: "var(--color-primary)",
                      marginTop: "var(--space-sm)",
                      borderRadius: "2px",
                    }}
                  ></div>
                </div>
                <Link
                  to={`/product-category/${category.split(" ").join("-")}`}
                  onClick={() => clickToviewCategory(category)}
                  className="btn-minimal btn-outline btn-text bangla"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 20px",
                    minHeight: "40px",
                    backgroundColor: "transparent",
                    color: "#111827",
                    borderRadius: "9999px",
                    border: "1px solid #e5e7eb",
                    fontSize: "14px",
                    fontWeight: "600",
                    fontFamily: "Hind Siliguri, sans-serif",
                    textDecoration: "none",
                  }}
                >
                  সব দেখুন
                </Link>
              </motion.div>
            )}

            {/* Products Grid - Ultra Minimal */}
            {loading ? (
              <div className="product-grid-minimal">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="card-minimal animate-pulse overflow-hidden"
                  >
                    <div
                      className="aspect-square"
                      style={{ backgroundColor: "var(--color-bg-light)" }}
                    ></div>
                    <div className="p-4 space-y-3">
                      <div
                        className="h-4 rounded-full w-3/4"
                        style={{ backgroundColor: "var(--color-bg-light)" }}
                      ></div>
                      <div
                        className="h-4 rounded-full w-1/2"
                        style={{ backgroundColor: "var(--color-bg-light)" }}
                      ></div>
                      <div
                        className="h-10 rounded"
                        style={{ backgroundColor: "var(--color-bg-light)" }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="product-grid-minimal">
                {getProductsByCategory(category)
                  .slice(0, 5)
                  .map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08, duration: 0.4 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CategoryByProducts;
