import React from "react";
import "./index.css";

const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        width: "100%",
      }}
    >
      {/* Modern Minimal Spinner */}
      <div
        style={{
          width: "56px",
          height: "56px",
          border: "4px solid #F0F0F0",
          borderTop: "4px solid #016737",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p
        style={{
          fontSize: "15px",
          color: "#999999",
          fontFamily: "Hind Siliguri, sans-serif",
          fontWeight: "500",
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
  );
};

export default LoadingSpinner;
