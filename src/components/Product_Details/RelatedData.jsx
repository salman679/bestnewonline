import React, { useContext, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import { Navigation, Scrollbar, Autoplay } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../features/products/productSlice";
import { Link, useLocation } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import { IndexContext } from "../../context";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { fetchProducts } from "../../redux/features/products/productSlice";
import { use } from "react";
import ProductCard from "../Home/categoryByProducts/productCard";

function RelatedData({ productCategory }) {
  const { setProductId } = useContext(IndexContext);
  const { products, isLoading } = useSelector((store) => store.products);
  const dispatch = useDispatch();

  const thisProduct = useLocation();
  const productSlug = thisProduct.pathname.split("/").pop();
  const withoutthisproduct = products.filter((p) => p.slug !== productSlug);

  useEffect(() => {
    dispatch(fetchProducts(productCategory));
  }, [productCategory, dispatch]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
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
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1440px",
        margin: "0 auto",
        padding: "64px 24px",
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
        className="flex-col md:flex-row gap-4 md:gap-0"
      >
        <div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "600",
              fontFamily: "Hind Siliguri, sans-serif",
              color: "#1A1A1A",
              marginBottom: "4px",
            }}
            className="max-[640px]:text-xl"
          >
            সম্পর্কিত পণ্য
          </h2>
          <div
            style={{
              height: "3px",
              width: "60px",
              backgroundColor: "#016737",
              borderRadius: "2px",
            }}
          />
        </div>
        <p
          style={{
            fontSize: "14px",
            color: "#666666",
            fontFamily: "Hind Siliguri, sans-serif",
          }}
          className="max-[640px]:hidden"
        >
          আপনার পছন্দের আরো পণ্য আবিষ্কার করুন
        </p>
      </div>

      <Swiper
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 16 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 24 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
        navigation={true}
        scrollbar={{ draggable: true }}
        modules={[Navigation, Scrollbar, Autoplay]}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        slidesPerGroup={1}
        style={{
          padding: "16px 8px 40px",
          overflow: "visible",
        }}
        className="related-products-swiper"
      >
        {withoutthisproduct?.length > 0 ? (
          withoutthisproduct?.slice(0, 10).map((product) => (
            <SwiperSlide key={product._id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))
        ) : (
          <div
            style={{
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
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
                কোনো পণ্য পাওয়া যায়নি
              </p>
            </div>
          </div>
        )}
      </Swiper>
    </div>
  );
}

export default RelatedData;
