// app/components/HeroSection.jsx
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative bg-blue-950 text-white py-20">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            স্বাগতম <span className="text-yellow-400">আপনার স্কুলে</span>
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            আধুনিক শিক্ষা, উদ্ভাবন ও মূল্যবোধে গঠিত একটি শিক্ষাপ্রতিষ্ঠান।
          </p>
          <a
            href="#download"
            className="bg-yellow-400 text-blue-950 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            আমাদের অ্যাপ ডাউনলোড করুন
          </a>
        </div>

        <div className="flex-1">
          <Image
            src="/images/banner.jpg"
            alt="স্কুল ব্যানার"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
