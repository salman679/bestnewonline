import React, { useEffect, useState } from "react";
import Banner from "../components/Home/banner/Banner";
import CategoryByProducts from "../components/Home/categoryByProducts/CategoryByProducts";
import { motion } from "framer-motion";
import { FaHeadset, FaMoneyCheckAlt, FaTag } from "react-icons/fa";
import { HiTruck, HiShieldCheck } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axiosInstanace";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../redux/features/products/productSlice";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    const formattedCategory = category.toLowerCase().split(" ").join("-");
    dispatch(fetchProducts(category));
    navigate(`/product-category/${formattedCategory}`);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Newsletter submission logic here
    alert("Thank you for subscribing!");
    setEmail("");
  };

  const features = [
    {
      icon: <HiTruck className="w-10 h-10" />,
      title: "দ্রুত ডেলিভারি",
      titleEn: "Fast Delivery",
      description: "৳৩০০০+ অর্ডারে ফ্রি ডেলিভারি",
      iconColor: "text-gray-700",
    },
    {
      icon: <FaHeadset className="w-10 h-10" />,
      title: "২৪/৭ সাপোর্ট",
      titleEn: "24/7 Support",
      description: "সবসময় আপনার সেবায়",
      iconColor: "text-gray-700",
    },
    {
      icon: <HiShieldCheck className="w-10 h-10" />,
      title: "নিরাপদ পেমেন্ট",
      titleEn: "Secure Payment",
      description: "১০০% নিরাপদ লেনদেন",
      iconColor: "text-gray-700",
    },
    {
      icon: <FaMoneyCheckAlt className="w-10 h-10" />,
      title: "ক্যাশ অন ডেলিভারি",
      titleEn: "Cash on Delivery",
      description: "পণ্য পেয়ে টাকা দিন",
      iconColor: "text-gray-700",
    },
  ];

  const offers = [
    {
      title: "মেগা সেল",
      subtitle: "৫০% পর্যন্ত ছাড়",
      description: "নির্বাচিত ক্যাটাগরিতে",
      cta: "কেনাকাটা করুন",
      link: "/product-category",
    },
    {
      title: "নতুন আগমন",
      subtitle: "তাজা কালেকশন",
      description: "সর্বশেষ পণ্য দেখুন",
      cta: "এখনই দেখুন",
      link: "/product-category",
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg-white)" }}
    >
      {/* Hero Section with Ultra-Minimal Banner */}
      <Banner />

      <div className="container-minimal">
        {/* Category Showcase Section - Ultra Minimal */}
        <section className="section-spacing">
          <div className="mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 max-[640px]:mb-8"
            >
              <h2
                className="heading-2 bangla mb-3"
                style={{ color: "var(--color-text-primary)" }}
              >
                ক্যাটাগরি অনুযায়ী কেনাকাটা করুন
              </h2>
              <p
                className="body-text"
                style={{
                  color: "var(--color-text-secondary)",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                সকল ধরনের পণ্যের বিশাল কালেকশন
              </p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-[640px]:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-4/5 rounded-lg animate-pulse"
                    style={{ backgroundColor: "var(--color-bg-light)" }}
                  ></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-[640px]:gap-4">
                {categories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="card-minimal shadow-minimal-hover cursor-pointer group"
                    onClick={() => handleCategoryClick(category.category)}
                  >
                    <div
                      className="aspect-4/5 relative overflow-hidden"
                      style={{
                        borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
                      }}
                    >
                      <img
                        src={
                          category.image?.includes("ik.imagekit.io")
                            ? `${category.image}?tr=w-300,h-375,f-webp,q-80`
                            : category.image || "/images/placeholder.jpg"
                        }
                        alt={category.category}
                        width={300}
                        height={375}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3
                        className="heading-3 bangla"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {category.category}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Products & Category Products */}
        <CategoryByProducts />

        {/* Special Offers Section - Ultra Minimal */}
        <section className="section-spacing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 max-[640px]:mb-8"
          >
            <h2
              className="heading-2 bangla mb-3"
              style={{ color: "var(--color-text-primary)" }}
            >
              বিশেষ অফার
            </h2>
            <p
              className="body-text"
              style={{ color: "var(--color-text-secondary)" }}
            >
              সীমিত সময়ের জন্য বিশেষ ছাড়
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-[640px]:gap-4">
            {offers.map((offer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="card-minimal p-8 max-[640px]:p-6 hover:shadow-lg transition-all cursor-pointer"
                style={{ backgroundColor: "var(--color-bg-soft)" }}
              >
                <div className="mb-4">
                  <FaTag
                    className="w-8 h-8"
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <h3
                  className="heading-2 bangla mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {offer.title}
                </h3>
                <p
                  className="heading-1 bangla mb-3"
                  style={{ color: "var(--color-primary)" }}
                >
                  {offer.subtitle}
                </p>
                <p
                  className="body-text bangla mb-6"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {offer.description}
                </p>
                <Link
                  to={offer.link}
                  className="btn-minimal btn-primary btn-text bangla"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 24px",
                    minHeight: "44px",
                    minWidth: "120px",
                    backgroundColor: "#016737",
                    color: "#ffffff",
                    borderRadius: "9999px",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "Hind Siliguri, sans-serif",
                    transition: "all 0.3s ease",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#034425";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#016737";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {offer.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section - Ultra Minimal */}
        <section
          className="section-spacing p-6 md:p-12"
          style={{
            backgroundColor: "var(--color-bg-soft)",
            borderRadius: "var(--radius-xl)",
          }}
        >
          <div className="mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 max-[640px]:mb-8"
            >
              <h2
                className="heading-2 bangla mb-3"
                style={{ color: "var(--color-text-primary)" }}
              >
                কেন আমাদের বেছে নেবেন
              </h2>
              <p
                className="body-text"
                style={{ color: "var(--color-text-secondary)" }}
              >
                গ্রাহক সেবায় আমাদের অঙ্গীকার
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-[640px]:gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-minimal p-6 text-center group hover:shadow-lg transition-all"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="mb-4 flex justify-center"
                    style={{ color: feature.iconColor }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className="heading-3 bangla mb-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-small bangla"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section - Ultra Minimal */}
        <section className="section-spacing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-minimal p-12 max-[640px]:p-8 text-center"
            style={{ backgroundColor: "var(--color-bg-soft)" }}
          >
            <div>
              <h2
                className="heading-2 bangla mb-3"
                style={{ color: "var(--color-text-primary)" }}
              >
                নিউজলেটার সাবস্ক্রাইব করুন
              </h2>
              <p
                className="body-text bangla mb-8"
                style={{
                  color: "var(--color-text-secondary)",
                  maxWidth: "500px",
                  margin: "0 auto 2rem",
                }}
              >
                নতুন অফার এবং পণ্য সম্পর্কে সর্বপ্রথম জানুন
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="max-w-lg mx-auto"
              >
                <div className="flex gap-3 max-[640px]:flex-col">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="আপনার ইমেইল এড্রেস"
                    required
                    className="input-minimal flex-1"
                  />
                  <button
                    type="submit"
                    className="btn-minimal btn-primary btn-text bangla px-8"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "12px 32px",
                      minHeight: "48px",
                      minWidth: "120px",
                      backgroundColor: "#016737",
                      color: "#ffffff",
                      borderRadius: "9999px",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "Hind Siliguri, sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    সাবস্ক্রাইব
                  </button>
                </div>
              </form>
              <p
                className="text-small bangla mt-4"
                style={{
                  color: "var(--color-text-muted)",
                  fontFamily: "Hind Siliguri, sans-serif",
                }}
              >
                যেকোনো সময় আনসাবসক্রাইব করুন
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Home;
