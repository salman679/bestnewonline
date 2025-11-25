import React, { Suspense } from "react";

import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
const Navbar = React.lazy(() => import("./components/Navbar"));
import { useContext, useEffect } from "react";
const UpdateProfile = React.lazy(() => import("./components/UpdateProfile"));
const Footer = React.lazy(() => import("./components/Footer"));
const ContactUs = React.lazy(() => import("./components/Contact_Us"));
const ErrorPage = React.lazy(() => import("./components/ErrorPage"));
import { Helmet } from "react-helmet";
const Wishlist = React.lazy(() => import("./components/user-account/Wishlist"));
const Register = React.lazy(() => import("./pages/auth/Register"));
import { AuthContext } from "./context/auth/AuthContext";
const LogIn = React.lazy(() => import("./pages/auth/LogIn"));
const ShoppingCart = React.lazy(() =>
  import("./components/shopping/ShoppingCart")
);
const ProductCategories = React.lazy(() => import("./pages/Product_Categorys"));
const ProductDetails = React.lazy(() => import("./pages/ProductDetails"));
const MyOrder = React.lazy(() => import("./components/user-account/My_Order"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const OrderConfirmation = React.lazy(() => import("./pages/OrderConfirmation"));
const PrivateRoute = React.lazy(() =>
  import("./components/routes/PrivateRoute")
);
const AdminRoute = React.lazy(() => import("./components/routes/AdminRoute"));
const Dashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const DashboardLayout = React.lazy(() => import("./layout/DashboardLayout"));
const AllProducts = React.lazy(() =>
  import("./pages/admin/products/All_Products")
);
const ProductForm = React.lazy(() =>
  import("./pages/admin/products/Add_Product")
);
const AddCategories = React.lazy(() =>
  import("./pages/admin/categories/Add_Categories")
);
const EditProduct = React.lazy(() =>
  import("./pages/admin/products/Edit_Product")
);
const AllOrders = React.lazy(() => import("./pages/admin/orders/AllOrders"));
const PendingOrders = React.lazy(() =>
  import("./pages/admin/orders/PendingOrders")
);
const CompletedOrders = React.lazy(() =>
  import("./pages/admin/orders/CompletedOrders")
);
const Users = React.lazy(() => import("./pages/admin/users/Users"));
const OrderManagement = React.lazy(() =>
  import("./pages/admin/orders/OrderManagement")
);
const SiteAnalytics = React.lazy(() =>
  import("./pages/admin/analytics/SiteAnalytics")
);
const Settings = React.lazy(() => import("./pages/admin/settings/Settings"));
const PublicProfile = React.lazy(() => import("./components/PublicProfile"));
const ContactMessages = React.lazy(() =>
  import("./pages/admin/ContactMessages")
);
const SalesReport = React.lazy(() => import("./pages/admin/SalesReport"));
import { FaWhatsapp } from "react-icons/fa";
import { IndexContext } from "./context";
const BannerManagement = React.lazy(() =>
  import("./pages/admin/banners/BannerManagement")
);
const ScrollToTop = React.lazy(() => import("./components/ScrollToTop"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const PixelSetup = React.lazy(() =>
  import("./pages/admin/settings/PixelSetUP")
);

import useFacebookPixel from "./hooks/useFacebookPixel";
import useFetchPixel from "./hooks/useFetchPixel";
import FacebookNoScript from "./utils/FacebookNoScript";
import LoadingSpinner from "./components/common/LoadingSpinner";

const Home = React.lazy(() => import("./pages/Home"));

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
        <meta charSet="utf-8" />
        <title>{pageTitle}</title>
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph for social media */}
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:description"
          content={`Explore ${formatted} at ${siteSettings?.siteName}`}
        />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="./assets/buynestonline.jpg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta
          name="twitter:description"
          content={`Explore ${formatted} at ${siteSettings?.siteName}`}
        />
        <meta name="twitter:image" content="./assets/buynestonline.jpg" />

        {/* Additional Metadata for SEO */}
        <meta name="robots" content="index, follow" />
        <meta property="og:site_name" content={`${siteSettings?.siteName}`} />
        <meta name="twitter:creator" content={`@${siteSettings?.siteName}`} />
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
