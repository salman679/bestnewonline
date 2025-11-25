import { useState, useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import "rc-slider/assets/index.css";
import LeftSidebar from "../components/productCategory/LeftSidebar";
import RightSidebar from "../components/productCategory/RightSidebar";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/products/productSlice";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axiosInstanace";
import ScrollToTop from "../components/ScrollToTop";

function ProductList() {
  const [price, setPrice] = useState(5000); // Default price
  const [openDropdown, setOpenDropdown] = useState(null); // Dropdown state
  const [showSidebar, setShowSidebar] = useState(false); // Sidebar visibility state
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Screen width state
  const dispatch = useDispatch();
  const { category, subCategory } = useParams();
  const [mainProducts, setMainProducts] = useState([]);
  const { products, isLoading } = useSelector((store) => store.products);

  useEffect(() => {
    setMainProducts(products);
  }, [products]); // Update `mainProducts` whenever `products` change

  useEffect(() => {
    if (category || subCategory) {
      const filteredProducts = products?.filter(
        (product) =>
          product?.category?.toLowerCase() === category?.toLowerCase() ||
          product?.subCategory?.toLowerCase() === subCategory?.toLowerCase()
      );

      setMainProducts(filteredProducts);
    } else {
      setMainProducts(products); // Reset to all products if no category or subCategory
    }
  }, [category, subCategory, products]); // Dependencies only on category, subCategory, and products

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide sidebar if screen width is 124px or less
  useEffect(() => {
    if (screenWidth <= 124) {
      setShowSidebar(false);
    }
  }, [screenWidth]);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Sorting option state
  const [sortOption, setSortOption] = useState("default");

  const getSortedProducts = () => {
    if (!Array.isArray(mainProducts) || mainProducts?.length === 0) {
      return [];
    }

    let sorted = [...mainProducts];

    switch (sortOption) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        sorted.sort(
          (a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0)
        );
        break;
      case "price-desc":
        sorted.sort(
          (a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0)
        );
        break;
      default:
        break;
    }

    return sorted;
  };

  // On change dropdown
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  return (
    <div
      style={{
        maxWidth: "1440px",
        margin: "0 auto",
        padding: "32px 24px",
      }}
    >
      <ScrollToTop />
      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        <LeftSidebar
          toggleDropdown={toggleDropdown}
          price={price}
          setPrice={setPrice}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          mainProducts={mainProducts}
          setMainProducts={setMainProducts}
        />

        <RightSidebar
          sortOption={sortOption}
          handleSortChange={handleSortChange}
          getSortedProducts={getSortedProducts}
        />
      </div>
    </div>
  );
}

export default ProductList;
