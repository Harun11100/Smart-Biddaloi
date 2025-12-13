// app/components/DownloadAppSection.jsx
import Image from "next/image";

export default function DownloadAppSection() {
  return (
    <section id="download" className="py-20 bg-gray-100">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">আমাদের স্কুল অ্যাপ ডাউনলোড করুন</h2>

        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          আমাদের অফিসিয়াল মোবাইল অ্যাপের মাধ্যমে স্কুলের আপডেট, শিক্ষার্থীদের ফলাফল এবং গুরুত্বপূর্ণ
          নোটিশ সহজেই পেয়ে যান।
        </p>

        <Image
          src="/images/app-preview.png"
          alt="অ্যাপের প্রিভিউ"
          width={250}
          height={250}
          className="mx-auto mb-8 rounded-lg shadow-lg"
        />

        <a
          href="https://example.com/app-download"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition"
        >
          সর্বশেষ ভার্সন ডাউনলোড করুন
        </a>
      </div>
    </section>
  );
}
