import Description from "../components/Product_Details/Description";
import Addtocart from "../components/Product_Details/Addtocart";
import RelatedData from "../components/Product_Details/RelatedData";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axiosInstanace";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ProductJsonLd from "../components/common/ProductJsonLd";
import { Helmet } from "react-helmet";
import { IndexContext } from "../context";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const { siteSettings } = useContext(IndexContext);

  useEffect(() => {
    setProduct(null); // নতুন slug এলে পুরনো প্রোডাক্ট clear করে দাও
    setIsLoading(true);
    const productfetch = async () => {
      try {
        const res = await axiosInstance(`/products/${params?.slug}`);
        setProduct(res?.data?.product);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setIsLoading(false);
      }
    };
    productfetch();
  }, [params?.slug]);

  if (isLoading) {
    return (
      <div className="h-screen">
        {" "}
        <div className="relative w-full h-screen flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Calculate final price for SEO
  const finalPrice = product
    ? product.price - (product.price * (product.discount || 0)) / 100
    : 0;

  return (
    <>
      {/* SEO Meta Tags */}
      {product && (
        <Helmet>
          <title>
            {product.name} | {siteSettings?.siteName || "BuyNest"}
          </title>
          <meta
            name="description"
            content={
              product.description?.replace(/<[^>]*>/g, "").substring(0, 160) ||
              `${product.name} - কিনুন ${
                siteSettings?.siteName || "BuyNest"
              } থেকে`
            }
          />
          <meta property="og:title" content={product.name} />
          <meta
            property="og:description"
            content={
              product.description?.replace(/<[^>]*>/g, "").substring(0, 160) ||
              product.name
            }
          />
          <meta property="og:image" content={product.image?.[0]} />
          <meta property="og:type" content="product" />
          <meta
            property="product:price:amount"
            content={finalPrice.toFixed(2)}
          />
          <meta property="product:price:currency" content="BDT" />
        </Helmet>
      )}

      {/* Product JSON-LD Structured Data */}
      <ProductJsonLd product={product} siteSettings={siteSettings} />

      <div className="max-w-[1300px] mx-auto">
        <Addtocart oneProduct={product} isLoading={isLoading} />
        <Description oneProduct={product} isLoading={isLoading} />
        <RelatedData productCategory={product?.category} />
      </div>
    </>
  );
};

export default ProductDetails;
