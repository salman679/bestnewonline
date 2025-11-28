import React, { useState } from "react";

/**
 * OptimizedImage Component
 * - Adds ImageKit transformations for WebP/AVIF conversion
 * - Supports responsive images with srcset
 * - Includes width/height to prevent CLS
 * - Supports fetchpriority for LCP images
 * - Lazy loading for non-critical images
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  style = {},
  isLCP = false,
  sizes = "100vw",
  objectFit = "cover",
  quality = 80,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if it's an ImageKit URL
  const isImageKit = src?.includes("ik.imagekit.io");

  // Generate optimized URL with ImageKit transformations
  const getOptimizedUrl = (imgSrc, w, h, format = "webp") => {
    if (!imgSrc) return "";

    if (isImageKit) {
      // Add ImageKit transformations
      const separator = imgSrc.includes("?") ? "&" : "?";
      return `${imgSrc}${separator}tr=w-${w},h-${h},f-${format},q-${quality}`;
    }

    // For non-ImageKit URLs, return as-is
    return imgSrc;
  };

  // Generate srcset for responsive images
  const generateSrcSet = (imgSrc) => {
    if (!imgSrc || !isImageKit) return "";

    const widths = [320, 480, 640, 768, 1024, 1280];
    return widths
      .filter((w) => w <= (width || 1280))
      .map((w) => {
        const h = height ? Math.round((w / width) * height) : w;
        return `${getOptimizedUrl(imgSrc, w, h)} ${w}w`;
      })
      .join(", ");
  };

  const optimizedSrc = getOptimizedUrl(src, width || 800, height || 800);
  const srcSet = generateSrcSet(src);

  // Placeholder/skeleton while loading
  const placeholderStyle = {
    backgroundColor: "#f3f4f6",
    ...style,
  };

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width, height, ...placeholderStyle }}
      >
        <span className="text-gray-400 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet || undefined}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={isLCP ? "eager" : "lazy"}
      fetchPriority={isLCP ? "high" : "auto"}
      decoding={isLCP ? "sync" : "async"}
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
      className={className}
      style={{
        objectFit,
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.3s ease",
        ...style,
      }}
      {...props}
    />
  );
};

export default OptimizedImage;
