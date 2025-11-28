import React from "react";
import { motion } from "framer-motion";

const ReturnPolicy = () => {
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
            রিটার্ন পলিসি
          </h1>
          <p className="body-text bangla text-[var(--color-text-secondary)]">
            পণ্য ফেরত ও পরিবর্তনের নিয়মাবলী
          </p>
          <div className="w-16 h-1 bg-[var(--color-primary)] mx-auto mt-6 rounded-full"></div>
        </motion.div>
      </div>

      <div className="container-minimal max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card-minimal p-8 md:p-12 bg-white"
        >
          <div className="space-y-8 bangla-text">
            <section>
              <h2 className="heading-3 bangla mb-4 text-[var(--color-text-primary)]">
                শর্তাবলী
              </h2>
              <p className="body-text bangla text-[var(--color-text-secondary)] mb-2">
                আমরা সর্বদা আমাদের পণ্যের গুণগত মান নিশ্চিত করি। তবুও যদি কোনো
                সমস্যা থাকে, তবে নিচের শর্তসাপেক্ষে পণ্য ফেরত দেওয়া যাবে:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)]">
                <li>পণ্য হাতে পাওয়ার ৩ দিনের মধ্যে অভিযোগ জানাতে হবে।</li>
                <li>
                  পণ্যটি অব্যবহৃত এবং এর অরিজিনাল প্যাকেজিং অক্ষত থাকতে হবে।
                </li>
                <li>
                  পণ্যটি ভাঙা বা ছেঁড়া থাকলে ডেলিভারি ম্যানের সামনেই চেক করে
                  ফেরত দিতে হবে।
                </li>
              </ul>
            </section>

            <section>
              <h2 className="heading-3 bangla mb-4 text-[var(--color-text-primary)]">
                যেসব ক্ষেত্রে রিটার্ন প্রযোজ্য নয়
              </h2>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)]">
                <li>পণ্য ব্যবহারের পর কোনো সমস্যা দেখা দিলে।</li>
                <li>মনের পরিবর্তন বা পছন্দ না হওয়ার কারণে (শর্তসাপেক্ষ)।</li>
              </ul>
            </section>

            <section>
              <h2 className="heading-3 bangla mb-4 text-[var(--color-text-primary)]">
                রিফান্ড প্রসেস
              </h2>
              <p className="body-text bangla text-[var(--color-text-secondary)]">
                পণ্য ফেরতের পর আমাদের টিম সেটি যাচাই করবে। যাচাই শেষে ৩-৭
                কর্মদিবসের মধ্যে আপনার প্রদত্ত মাধ্যম (বিকাশ/নগদ/ব্যাংক) এ টাকা
                ফেরত দেওয়া হবে।
              </p>
            </section>

            <section>
              <h2 className="heading-3 bangla mb-4 text-[var(--color-text-primary)]">
                যোগাযোগ
              </h2>
              <p className="body-text bangla text-[var(--color-text-secondary)]">
                রিটার্ন সংক্রান্ত যেকোনো সহযোগিতার জন্য আমাদের কাস্টমার কেয়ারে
                যোগাযোগ করুন: <strong>+880 1234-567890</strong>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
