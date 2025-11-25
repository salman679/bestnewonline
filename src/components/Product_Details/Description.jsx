import { useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaBox,
  FaShieldAlt,
  FaTruck,
  FaUndo,
} from "react-icons/fa";
import "react-quill/dist/quill.snow.css";

function Description({ oneProduct, isLoading }) {
  const [activeTab, setActiveTab] = useState("description");

  if (isLoading) {
    return (
      <div className="animate-pulse p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (!oneProduct) {
    return (
      <div className="flex items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <FaExclamationTriangle className="text-orange-500 mr-2" />
        <span className="text-gray-600 dark:text-gray-300">
          Product not found
        </span>
      </div>
    );
  }

  const tabs = [
    { id: "description", label: "বিবরণ", icon: FaInfoCircle },
    { id: "specifications", label: "বিশেষ বৈশিষ্ট্য", icon: FaBox },
    { id: "additional", label: "অতিরিক্ত তথ্য", icon: FaShieldAlt },
  ];

  return (
    <>
      <style>
        {`
          .quill-content {
            font-family: inherit;
          }
          
          .quill-content h1 {
            font-size: 2em;
            margin-bottom: 0.5em;
            font-weight: bold;
          }
          
          .quill-content h2 {
            font-size: 1.5em;
            margin-bottom: 0.5em;
            font-weight: bold;
          }
          
          .quill-content p {
            margin-bottom: 1em;
          }
          
          .quill-content ul, .quill-content ol {
            margin-left: 1.5em;
            margin-bottom: 1em;
          }
          
          .quill-content ul {
            list-style-type: disc;
          }
          
          .quill-content ol {
            list-style-type: decimal;
          }
          
          .quill-content li {
            margin-bottom: 0.5em;
          }
          
          .quill-content a {
            color: #016737;
            text-decoration: underline;
          }
          
          .dark .quill-content a {
            color: #34d399;
          }
          
          .quill-content img {
            max-width: 100%;
            height: auto;
            margin: 1em 0;
            border-radius: 0.5rem;
          }
          
          .quill-content blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 1em;
            margin: 1em 0;
            font-style: italic;
          }
          
          .dark .quill-content blockquote {
            border-left-color: #4b5563;
          }
        `}
      </style>
      <div
        className="container-minimal"
        style={{ paddingTop: "var(--space-2xl)" }}
      >
        {/* Ultra-Minimal Tabs */}
        <div
          className="flex gap-6 overflow-x-auto"
          style={{
            borderBottom: "1px solid var(--color-border)",
            paddingBottom: "1px",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 pb-4 text-small font-medium transition-all bangla-text whitespace-nowrap relative"
              style={{
                color:
                  activeTab === tab.id
                    ? "var(--color-primary)"
                    : "var(--color-text-secondary)",
                borderBottom:
                  activeTab === tab.id
                    ? "2px solid var(--color-primary)"
                    : "none",
                marginBottom: "-1px",
              }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content - Ultra Minimal */}
        <div style={{ paddingTop: "var(--space-xl)" }}>
          {/* Description Tab */}
          <div className={activeTab === "description" ? "block" : "hidden"}>
            <div className="mb-12 max-[640px]:mb-8">
              <div
                className="body-text leading-relaxed quill-content"
                style={{ color: "var(--color-text-secondary)" }}
                dangerouslySetInnerHTML={{
                  __html: oneProduct?.description || "",
                }}
              />
            </div>

            {/* Key Features - Ultra Minimal */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-minimal p-6">
                <FaTruck
                  className="w-5 h-5 mb-3"
                  style={{ color: "var(--color-primary)" }}
                />
                <h4
                  className="heading-3 bangla mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  ফ্রি ডেলিভারি
                </h4>
                <p
                  className="text-small bangla-text"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  ৳২৫০০+ অর্ডারে
                </p>
              </div>
              <div className="card-minimal p-6">
                <FaShieldAlt
                  className="w-5 h-5 mb-3"
                  style={{ color: "var(--color-primary)" }}
                />
                <h4
                  className="heading-3 bangla mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  নিরাপদ পেমেন্ট
                </h4>
                <p
                  className="text-small bangla-text"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  ১০০% সুরক্ষিত
                </p>
              </div>
              <div className="card-minimal p-6">
                <FaUndo
                  className="w-5 h-5 mb-3"
                  style={{ color: "var(--color-primary)" }}
                />
                <h4
                  className="heading-3 bangla mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  সহজ রিটার্ন
                </h4>
                <p
                  className="text-small bangla-text"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  ৣ দিনের মধ্যে
                </p>
              </div>
              <div className="card-minimal p-6">
                <FaCheckCircle
                  className="w-5 h-5 mb-3"
                  style={{ color: "var(--color-primary)" }}
                />
                <h4
                  className="heading-3 bangla mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  অরিজিনাল পণ্য
                </h4>
                <p
                  className="text-small bangla-text"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  ১০০% অরিজিনাল
                </p>
              </div>
            </div>
          </div>

          {/* Specifications Tab */}
          <div
            className={`space-y-6 ${
              activeTab === "specifications" ? "block" : "hidden"
            }`}
          >
            {oneProduct?.specifications?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {oneProduct.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {spec.feature}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No specifications available
              </p>
            )}
          </div>

          {/* Additional Info Tab */}
          <div
            className={`space-y-6 ${
              activeTab === "additional" ? "block" : "hidden"
            }`}
          >
            {oneProduct?.additionalInfo?.length > 0 ? (
              <div className="space-y-4">
                {oneProduct.additionalInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-shadow duration-200"
                  >
                    <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <p className="ml-3 text-gray-600 dark:text-gray-300">
                      {info}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No additional information available
              </p>
            )}

            {/* Warranty & Return Policy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {oneProduct?.warranty && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center mb-3">
                    <FaShieldAlt className="w-5 h-5 text-orange-500" />
                    <h4 className="ml-2 font-medium text-gray-900 dark:text-white">
                      Warranty
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {oneProduct.warranty}
                  </p>
                </div>
              )}
              {oneProduct?.returnPolicy && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center mb-3">
                    <FaUndo className="w-5 h-5 text-orange-500" />
                    <h4 className="ml-2 font-medium text-gray-900 dark:text-white">
                      Return Policy
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {oneProduct.returnPolicy}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Description;
