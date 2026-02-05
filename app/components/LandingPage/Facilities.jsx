"use client";

import { BookOpen, Phone, Monitor, Bus, Trophy } from "lucide-react";

/* Custom Facilities Card */
function FacilitiesCard({ Icon, title, description }) {
  return (
    <div className="group relative h-full rounded-2xl border border-blue-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
      {/* Top Accent */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-600 to-emerald-500" />

      <div className="flex flex-col items-center text-center px-6 py-10">
        {/* Icon */}
        <div className="mb-5 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
          <Icon size={24} className="sm:text-[28px]" />
        </div>

        {/* Title */}
        <h3 className="mb-3 text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

const facilities = [
  {
    title: "গ্রন্থাগার",
    Icon: BookOpen,
    description:
      "আধুনিক বই, ডিজিটাল রিসোর্স এবং নীরব অধ্যয়ন পরিবেশসহ একটি সমৃদ্ধ গ্রন্থাগার।",
  },
  {
    title: "কম্পিউটার ল্যাব",
    Icon: Monitor,
    description:
      "উচ্চক্ষমতার কম্পিউটার ও আধুনিক সফটওয়্যার দ্বারা সজ্জিত ব্যবহারিক শিক্ষার ল্যাব।",
  },
  {
    title: "পরিবহন ব্যবস্থা",
    Icon: Bus,
    description:
      "শিক্ষার্থীদের জন্য নিরাপদ, সময়নিষ্ঠ ও নির্ভরযোগ্য পরিবহন সুবিধা।",
  },
  {
    title: "খেলার মাঠ",
    Icon: Trophy,
    description:
      "শারীরিক ও মানসিক বিকাশের জন্য সুসজ্জিত খেলার মাঠ ও ক্রীড়া উপকরণ।",
  },
  {
    title: "মোবাইল অ্যাপ",
    Icon: Phone,
    description:
      "স্কুলের নিজস্ব মোবাইল অ্যাপের মাধ্যমে নোটিশ, ফলাফল ও গুরুত্বপূর্ণ আপডেট।",
  },
];

export default function Facilities() {
  return (
    <section
      id="facilities"
      className="py-16 px-4 sm:px-6 md:px-16 bg-gradient-to-b from-emerald-50 via-white to-blue-50"
    >
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900">
          আমাদের সুবিধাসমূহ
        </h2>
        <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
          নিরাপদ, আধুনিক ও শিক্ষাবান্ধব পরিবেশ নিশ্চিত করার জন্য আমাদের অবকাঠামো।
        </p>
      </div>

      {/* Cards Grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {facilities.map((item) => (
          <FacilitiesCard
            key={item.title}
            Icon={item.Icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}
