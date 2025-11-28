import React from "react";
import { motion } from "framer-motion";

const DeliveryPolicy = () => {
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
            ডেলিভারি নীতি
          </h1>
          <p className="body-text bangla text-[var(--color-text-secondary)]">
            আমাদের ডেলিভারি সংক্রান্ত সকল নিয়মাবলী
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
                ডেলিভারি সময়সীমা
              </h2>
              <p className="body-text bangla text-[var(--color-text-secondary)] mb-2">
                আমরা দ্রুততম সময়ে আপনার পণ্য পৌঁছে দেওয়ার চেষ্টা করি।
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)]">
                <li>ঢাকার ভিতরে: ১-২ কর্মদিবস</li>
                <li>ঢাকার বাইরে: ২-৪ কর্মদিবস</li>
              </ul>
            </section>

            <section>
              <h2 className="heading-3 bangla mb-4 text-[var(--color-text-primary)]">
                ডেলিভারি চার্জ
              </h2>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)]">
                <li>ঢাকার ভিতরে: ৬০ টাকা</li>
                <li>ঢাকার বাইরে: ১২০ টাকা</li>
                <li>
                  ৩০০০ টাকার বেশি কেনাকাটায় ডেলিভারি চার্জ সম্পূর্ণ ফ্রি।
                </li>
              </ul>
            </section>

            <section>
              <h2 className="heading-3 bangla mb-4 text-[var(--color-text-primary)]">
                জরুরি ডেলিভারি
              </h2>
              <p className="body-text bangla text-[var(--color-text-secondary)]">
                জরুরি প্রয়োজনে সেইম ডে ডেলিভারি (শুধুমাত্র ঢাকা সিটির জন্য)
                সুবিধা রয়েছে। সেক্ষেত্রে অতিরিক্ত চার্জ প্রযোজ্য হতে পারে।
              </p>
            </section>

            <section>
              <h2 className="heading-3 bangla mb-4 text-[var(--color-text-primary)]">
                ট্র্যাকিং
              </h2>
              <p className="body-text bangla text-[var(--color-text-secondary)]">
                অর্ডার কনফার্ম করার পর আপনি একটি ট্র্যাকিং আইডি পাবেন যা দিয়ে
                আমাদের ওয়েবসাইটে অর্ডারের অবস্থান চেক করতে পারবেন।
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeliveryPolicy;
