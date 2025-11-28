import React, { Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { FaWhatsapp } from "react-icons/fa";

import Navbar from "./components/Navbar";
import UpdateProfile from "./components/UpdateProfile";
import Footer from "./components/Footer";
import ContactUs from "./components/Contact_Us";
import ErrorPage from "./components/ErrorPage";
import Wishlist from "./components/user-account/Wishlist";
import Register from "./pages/auth/Register";
import { AuthContext } from "./context/auth/AuthContext";
import LogIn from "./pages/auth/LogIn";
import ShoppingCart from "./components/shopping/ShoppingCart";
import ProductCategories from "./pages/Product_Categorys";
import ProductDetails from "./pages/ProductDetails";
import MyOrder from "./components/user-account/My_Order";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import PrivateRoute from "./components/routes/PrivateRoute";
import AdminRoute from "./components/routes/AdminRoute";
import Dashboard from "./pages/admin/Dashboard";
import DashboardLayout from "./layout/DashboardLayout";
import AllProducts from "./pages/admin/products/All_Products";
import ProductForm from "./pages/admin/products/Add_Product";
import AddCategories from "./pages/admin/categories/Add_Categories";
import EditProduct from "./pages/admin/products/Edit_Product";
import AllOrders from "./pages/admin/orders/AllOrders";
import PendingOrders from "./pages/admin/orders/PendingOrders";
import CompletedOrders from "./pages/admin/orders/CompletedOrders";
import Users from "./pages/admin/users/Users";
import OrderManagement from "./pages/admin/orders/OrderManagement";
import SiteAnalytics from "./pages/admin/analytics/SiteAnalytics";
import Settings from "./pages/admin/settings/Settings";
import PublicProfile from "./components/PublicProfile";
import ContactMessages from "./pages/admin/ContactMessages";
import SalesReport from "./pages/admin/SalesReport";
import BannerManagement from "./pages/admin/banners/BannerManagement";
import ScrollToTop from "./components/ScrollToTop";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQ from "./pages/FAQ";
import DeliveryPolicy from "./pages/DeliveryPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import PixelSetup from "./pages/admin/settings/PixelSetUP";
import useFacebookPixel from "./hooks/useFacebookPixel";
import useFetchPixel from "./hooks/useFetchPixel";
import FacebookNoScript from "./utils/FacebookNoScript";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Home from "./pages/Home";
import { IndexContext } from "./context";

const App = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/admin-dashboard");
  const pathSegments = pathname.split("/").filter(Boolean);
  const pathName = pathSegments[pathSegments.length - 1] || "Home";
  const formattedPath = pathName.replace(/-/g, " ");
  const { user, isLoading } = useContext(AuthContext);
  const { siteSettings } = useContext(IndexContext);
  const location = useLocation();
  const adminRoute = location.pathname.split[1]; // অথবা অন্য কোন লজিক
  const formatted =
    location.pathname === "/"
      ? "Home"
      : location.pathname.replace("/", "").charAt(0).toUpperCase() +
        location.pathname.replace("/", "").slice(1);

  const pageTitle = formattedPath
    ? `${siteSettings?.siteName} | ${formattedPath}`
    : `${siteSettings?.siteName}`;
  const pageUrl = `https://buynestonline.com${location.pathname}`;

  const pixel = useFetchPixel();
  const pixelId = pixel?.data?.pixelId;

  useFacebookPixel(
    pixelId && pixel?.data?.status === "active" ? pixelId : null
  );

  return (
    <>
      <Helmet>
        <html lang="bn" />
        <meta charSet="utf-8" />
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="BuyNest - বাংলাদেশের সেরা অনলাইন শপিং প্ল্যাটফর্ম। ইসলামিক ও লাইফস্টাইল পণ্যের বিশাল কালেকশন, ১০০% অরিজিনাল গ্যারান্টি।"
        />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph for social media */}
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:description"
          content={`${
            siteSettings?.siteName || "BuyNest"
          } - বাংলাদেশের বিশ্বস্ত অনলাইন শপ`}
        />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="bn_BD" />
        <meta
          property="og:image"
          content="https://buynestonline.com/logo.png"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta
          name="twitter:description"
          content={`${
            siteSettings?.siteName || "BuyNest"
          } - বাংলাদেশের বিশ্বস্ত অনলাইন শপ`}
        />
        <meta
          name="twitter:image"
          content="https://buynestonline.com/logo.png"
        />

        {/* Additional Metadata for SEO */}
        <meta name="robots" content="index, follow" />
        <meta
          property="og:site_name"
          content={`${siteSettings?.siteName || "BuyNest"}`}
        />
        <meta
          name="twitter:creator"
          content={`@${siteSettings?.siteName || "BuyNest"}`}
        />

        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteSettings?.siteName || "BuyNest",
            url: "https://buynestonline.com",
            logo: "https://buynestonline.com/logo.png",
            sameAs: [
              siteSettings?.socialMedia?.facebook || "",
              siteSettings?.socialMedia?.instagram || "",
            ].filter(Boolean),
          })}
        </script>
      </Helmet>
      <div className="sticky top-0 z-50 bg-white">
        {!isDashboard && <Navbar />}
      </div>
      <ScrollToTop />
      <div className="">
        <Suspense
          fallback={
            <div>
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/delivery-policy" element={<DeliveryPolicy />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />

            {/* Dynamic Product Category Route */}
            <Route
              path="/product-category/:category?"
              element={<ProductCategories />}
            />

            {/* Product Details */}
            <Route path="/products/:slug" element={<ProductDetails />} />
            <Route path="/shopping-cart" element={<ShoppingCart />} />

            {/* Protected Routes */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrder />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route
              path="/update-profile"
              element={
                <PrivateRoute>
                  <UpdateProfile />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <AdminRoute>
                  <DashboardLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="all-products" element={<AllProducts />} />
              <Route path="add-product" element={<ProductForm />} />
              <Route path="edit-product/:id" element={<EditProduct />} />
              <Route path="add-category" element={<AddCategories />} />
              {/* <Route path="analytics" element={<SiteAnalytics />} /> */}
              <Route path="settings" element={<Settings />} />
              <Route path="banner-management" element={<BannerManagement />} />d
              {/* Orders */}
              <Route path="orders" element={<AllOrders />} />
              <Route path="orders/pending" element={<PendingOrders />} />
              <Route path="orders/completed" element={<CompletedOrders />} />
              <Route path="orders/management" element={<OrderManagement />} />
              {/* Users */}
              <Route path="users" element={<Users />} />
              <Route path="contact-messages" element={<ContactMessages />} />
              <Route path="sales-report" element={<SalesReport />} />
              <Route path="facebook-pixel" element={<PixelSetup />} />
            </Route>

            {/* Public Profile Route */}
            <Route
              path="/my-profile"
              element={
                <PrivateRoute>
                  <PublicProfile />
                </PrivateRoute>
              }
            />

            {/* 404 Page */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </div>
      {!isDashboard && <Footer />}
      <Toaster position="top-center" />
      {/* WhatsApp Floating Button */}
      <a
        href={siteSettings?.socialMedia?.whatsAppLink}
        target="_blank"
        rel="noreferrer noopener"
        className={`fixed bottom-12 right-4 z-50 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#25d366] ${
          adminRoute === "/admin-dashboard" ? "hidden" : ""
        }`}
      >
        <div className="absolute z-10 top-0 left-0 w-full h-full rounded-full bg-[#25d366] animate-ping"></div>
        <div className="relative z-20">
          <FaWhatsapp className="text-white w-6 h-6" />
        </div>
      </a>
      <FacebookNoScript pixelId={pixelId} />;
    </>
  );
};

export default App;
