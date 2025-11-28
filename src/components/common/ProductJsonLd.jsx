import { Helmet } from "react-helmet";

/**
 * ProductJsonLd Component
 * Generates JSON-LD structured data for product pages
 * Improves SEO and enables rich snippets in search results
 */
const ProductJsonLd = ({ product, siteSettings }) => {
  if (!product) return null;

  // Calculate final price with discount
  const finalPrice =
    product.price - (product.price * (product.discount || 0)) / 100;

  // Determine availability
  const availability =
    product.quantity > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  // Build the structured data object
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description?.replace(/<[^>]*>/g, "") || product.name, // Strip HTML tags
    image: product.image || [],
    sku: product.sku || product._id,
    brand: {
      "@type": "Brand",
      name: siteSettings?.siteName || "BuyNest",
    },
    offers: {
      "@type": "Offer",
      url: `https://buynestonline.com/products/${product.slug || product.name}`,
      priceCurrency: "BDT",
      price: finalPrice.toFixed(2),
      availability: availability,
      seller: {
        "@type": "Organization",
        name: siteSettings?.siteName || "BuyNest",
      },
    },
    category: product.category,
  };

  // Add aggregateRating if reviews exist
  if (product.reviews && product.reviews.length > 0) {
    const avgRating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: product.reviews.length,
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default ProductJsonLd;
