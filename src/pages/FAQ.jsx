import React from "react";
import { motion } from "framer-motion";

const FAQ = () => {
  const faqs = [
    {
      question: "কিভাবে অর্ডার করবেন?",
      answer:
        "আপনার পছন্দের পণ্যটি সিলেক্ট করে 'Buy Now' বাটনে ক্লিক করুন এবং প্রয়োজনীয় তথ্য দিয়ে অর্ডার কনফার্ম করুন।",
    },
    {
      question: "ডেলিভারি চার্জ কত?",
      answer:
        "ঢাকার ভিতরে ৬০ টাকা এবং ঢাকার বাইরে ১২০ টাকা। তবে ৩০০০ টাকার বেশি অর্ডারে ডেলিভারি চার্জ ফ্রি।",
    },
    {
      question: "পেমেন্ট পদ্ধতি কি কি?",
      answer:
        "আপনি বিকাশ, নগদ, রকেট অথবা ক্যাশ অন ডেলিভারির মাধ্যমে পেমেন্ট করতে পারবেন।",
    },
    {
      question: "ডেলিভারি পেতে কত দিন সময় লাগে?",
      answer:
        "ঢাকার ভিতরে ১-২ দিন এবং ঢাকার বাইরে ২-৪ দিনের মধ্যে ডেলিভারি সম্পন্ন করা হয়।",
    },
    {
      question: "পণ্য রিটার্ন করার নিয়ম কি?",
      answer:
        "পণ্য হাতে পাওয়ার ৩ দিনের মধ্যে কোনো সমস্যা থাকলে আমাদের জানাতে হবে। বিস্তারিত জানতে রিটার্ন পলিসি দেখুন।",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-white)] pt-12 pb-24">
      <div className="container-minimal mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h1 className="heading-1 bangla mb-4 text-[var(--color-text-primary)]">
            সাধারণ প্রশ্নাবলী (FAQ)
          </h1>
          <p className="body-text bangla text-[var(--color-text-secondary)]">
            আপনার সাধারণ প্রশ্নের উত্তর এখানে পাবেন
          </p>
          <div className="w-16 h-1 bg-[var(--color-primary)] mx-auto mt-6 rounded-full"></div>
        </motion.div>
      </div>

      <div className="container-minimal max-w-3xl">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="card-minimal p-6 bg-[var(--color-bg-soft)] border-none"
            >
              <h3 className="heading-3 bangla mb-3 text-[var(--color-text-primary)]">
                {faq.question}
              </h3>
              <p className="body-text bangla text-[var(--color-text-secondary)]">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
