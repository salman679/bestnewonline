import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./banner.css";
import { axiosInstance } from "../../../lib/axiosInstanace";

// Dummy banner images from Unsplash
const dummyBanners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop",
    alt: "Fashion Collection",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=600&fit=crop",
    alt: "Trendy Accessories",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=600&fit=crop",
    alt: "Premium Products",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop",
    alt: "Latest Trends",
  },
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState(dummyBanners);
  const [loading, setLoading] = useState(false);

  // Auto slide effect
  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "500px",
        overflow: "hidden",
        borderRadius: "0",
      }}
      className="max-[768px]:h-[350px] max-[640px]:h-[250px]"
    >
      {/* Modern Image Slider */}
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <img
              src={banners[currentSlide]?.image}
              alt={banners[currentSlide]?.alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />

            {/* Subtle Gradient Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          style={{
            position: "absolute",
            left: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "none",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
          className="hover:bg-white max-[640px]:w-10 max-[640px]:h-10 max-[640px]:left-3"
          aria-label="Previous slide"
        >
          <FaArrowLeft style={{ color: "#016737", fontSize: "18px" }} />
        </button>

        <button
          onClick={nextSlide}
          style={{
            position: "absolute",
            right: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "none",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
          className="hover:bg-white max-[640px]:w-10 max-[640px]:h-10 max-[640px]:right-3"
          aria-label="Next slide"
        >
          <FaArrowRight style={{ color: "#016737", fontSize: "18px" }} />
        </button>

        {/* Modern Slide Indicators */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "8px",
            zIndex: 20,
          }}
          className="max-[640px]:bottom-4"
        >
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? "32px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor:
                  currentSlide === index
                    ? "#FFFFFF"
                    : "rgba(255, 255, 255, 0.5)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow:
                  currentSlide === index
                    ? "0 2px 8px rgba(0, 0, 0, 0.2)"
                    : "none",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
