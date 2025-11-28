import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axiosInstanace";
import { IndexContext } from "../context";

const Contact_Us = () => {
  const { siteSettings } = useContext(IndexContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "নাম প্রয়োজন";
    }

    if (!formData.email.trim()) {
      newErrors.email = "ইমেইল প্রয়োজন";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "ইমেইল সঠিক নয়";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "ফোন নম্বর প্রয়োজন";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "বিষয় প্রয়োজন";
    }

    if (!formData.message.trim()) {
      newErrors.message = "বার্তা প্রয়োজন";
    }

    if (!formData.terms) {
      newErrors.terms = "আপনাকে শর্তাবলীতে সম্মত হতে হবে";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/contact", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      if (response.status === 201) {
        toast.success("বার্তা সফলভাবে পাঠানো হয়েছে!");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          terms: false,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        error.response?.data?.message ||
          "বার্তা পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-12 pb-24 font-bangla">
      {/* Header Section - Ultra Minimal */}
      <div className="container-minimal mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h1 className="heading-1 mb-4 text-gray-900 font-bangla">
            যোগাযোগ করুন
          </h1>
          <p className="body-text text-gray-600 font-bangla">
            আমরা আপনার যেকোনো প্রশ্নের উত্তর দিতে প্রস্তুত। আপনার মতামত আমাদের
            কাছে গুরুত্বপূর্ণ।
          </p>
          <div className="w-16 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
        </motion.div>
      </div>

      <div className="container-minimal">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information - Left Side */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card-minimal p-8 h-full bg-gray-50 border-none"
            >
              <h2 className="heading-3 mb-8 text-gray-900 font-bangla">
                যোগাযোগের মাধ্যম
              </h2>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 text-primary">
                    <FaEnvelope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 font-bangla">
                      ইমেইল
                    </h3>
                    <p className="body-text text-gray-600 break-all">
                      {siteSettings?.contactEmail ||
                        "support@buynestonline.com"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 text-primary">
                    <FaPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 font-bangla">
                      ফোন
                    </h3>
                    <p className="body-text text-gray-600">
                      {siteSettings?.contactPhone || "+880 1234-567890"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 text-primary">
                    <FaMapMarkerAlt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 font-bangla">
                      অফিস
                    </h3>
                    <p className="body-text text-gray-600 font-bangla">
                      {siteSettings?.address || "ঢাকা, বাংলাদেশ"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder or Decorative Element */}
              <div className="mt-12 p-4 bg-white rounded-lg border border-gray-200 text-center">
                <p className="text-small text-gray-500 font-bangla">
                  অফিস সময়: সকাল ৯:০০ - সন্ধ্যা ৬:০০ (শনি-বৃহস্পতি)
                </p>
              </div>
            </motion.div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card-minimal p-8 md:p-12"
            >
              <h2 className="heading-2 mb-8 text-gray-900 font-bangla">
                বার্তা পাঠান
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 font-bangla">
                      নাম
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`input-minimal ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      placeholder="আপনার নাম"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1 font-bangla">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 font-bangla">
                      ইমেইল
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-minimal ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      placeholder="আপনার ইমেইল"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1 font-bangla">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 font-bangla">
                      ফোন
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`input-minimal ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                      placeholder="আপনার ফোন নম্বর"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1 font-bangla">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 font-bangla">
                      বিষয়
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`input-minimal ${
                        errors.subject ? "border-red-500" : ""
                      }`}
                      placeholder="বার্তার বিষয়"
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-500 mt-1 font-bangla">
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900 font-bangla">
                    বার্তা
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`input-minimal resize-none ${
                      errors.message ? "border-red-500" : ""
                    }`}
                    placeholder="আমরা আপনাকে কীভাবে সাহায্য করতে পারি?"
                  ></textarea>
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1 font-bangla">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    name="terms"
                    id="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    className={`w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary ${
                      errors.terms ? "border-red-500" : ""
                    }`}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 font-bangla"
                  >
                    আমি{" "}
                    <a href="#" className="text-primary hover:underline">
                      শর্তাবলী
                    </a>{" "}
                    এবং গোপনীয়তা নীতির সাথে একমত
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-xs text-red-500 font-bangla">
                    {errors.terms}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-minimal btn-primary w-full md:w-auto min-w-[180px] font-bangla gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      পাঠানো হচ্ছে...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FaPaperPlane className="w-4 h-4" />
                      বার্তা পাঠান
                    </span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact_Us;
