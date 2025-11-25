import React from 'react';
import { Helmet } from 'react-helmet';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Privacy Policy - Buy Nest Online</title>
        <meta name="description" content="Privacy policy and data protection information for Buy Nest Online customers" />
      </Helmet>

      <div className="space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">তথ্য সংগ্রহ এবং ব্যবহার</h2>
            <div className="space-y-4 text-gray-600">
              <p>আমরা নিম্নলিখিত তথ্যগুলি সংগ্রহ করি:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>নাম এবং যোগাযোগের তথ্য</li>
                <li>ডেলিভারি ঠিকানা</li>
                <li>অর্ডার ইতিহাস</li>
                <li>পেমেন্ট সংক্রান্ত তথ্য</li>
                <li>ব্রাউজিং আচরণ এবং পছন্দসমূহ</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">আপনার তথ্যের ব্যবহার</h2>
            <div className="space-y-4 text-gray-600">
              <p>আমরা আপনার তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করি:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>অর্ডার প্রক্রিয়াকরণ এবং ডেলিভারি</li>
                <li>কাস্টমার সাপোর্ট প্রদান</li>
                <li>পণ্য এবং সেবার উন্নতি</li>
                <li>নিরাপত্তা এবং ফ্রড প্রতিরোধ</li>
                <li>আইনি বাধ্যবাধকতা পালন</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">তথ্য সুরক্ষা</h2>
            <div className="space-y-4 text-gray-600">
              <p>আমরা আপনার তথ্য সুরক্ষার জন্য নিম্নলিখিত পদক্ষেপ নিই:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL এনক্রিপশন ব্যবহার</li>
                <li>নিয়মিত সিকিউরিটি অডিট</li>
                <li>কঠোর ডেটা অ্যাক্সেস নীতি</li>
                <li>নিয়মিত ব্যাকআপ সংরক্ষণ</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">কুকি নীতি</h2>
            <div className="space-y-4 text-gray-600">
              <p>আমাদের ওয়েবসাইট কুকি ব্যবহার করে নিম্নলিখিত উদ্দেশ্যে:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>শপিং কার্ট ম্যানেজমেন্ট</li>
                <li>ব্যবহারকারী সেশন ট্র্যাকিং</li>
                <li>ওয়েবসাইট পারফরম্যান্স উন্নতি</li>
                <li>ব্যবহারকারী অভিজ্ঞতা উন্নতি</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">তৃতীয় পক্ষের সাথে তথ্য শেয়ার</h2>
            <div className="space-y-4 text-gray-600">
              <p>আমরা নিম্নলিখিত ক্ষেত্রে তৃতীয় পক্ষের সাথে তথ্য শেয়ার করি:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>ডেলিভারি পার্টনার</li>
                <li>পেমেন্ট প্রসেসর</li>
                <li>আইনি বাধ্যবাধকতা</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">আপনার অধিকার</h2>
            <div className="space-y-4 text-gray-600">
              <p>আপনার নিম্নলিখিত অধিকার রয়েছে:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>আপনার তথ্য দেখার অধিকার</li>
                <li>তথ্য সংশোধনের অধিকার</li>
                <li>তথ্য মুছে ফেলার অনুরোধ</li>
                <li>তথ্য প্রক্রিয়াকরণে আপত্তি জানানো</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">যোগাযোগ</h2>
            <div className="space-y-4 text-gray-600">
              <p>প্রাইভেসি সংক্রান্ত যেকোনো প্রশ্নের জন্য যোগাযোগ করুন:</p>
              <ul className="list-none space-y-2">
                <li>📧 ইমেইল: buynestonline.shop@gmail.com</li>
                <li>📞 ফোন: +8801614871922</li>
                <li>📍 ঠিকানা: ঢাকা, বাংলাদেশ</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="mt-12 p-6 bg-blue-50 rounded-xl">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">নীতিমালা আপডেট</h2>
          <p className="text-blue-700">
            আমরা এই প্রাইভেসি নীতিমালা যেকোনো সময় আপডেট করার অধিকার সংরক্ষণ করি। গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে আপনাকে ইমেইলের মাধ্যমে অবহিত করা হবে।
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 