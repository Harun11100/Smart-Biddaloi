"use client";

import { Trophy, Medal, Star } from "lucide-react";

const students = [
  {
    id: 1,
    name: "আয়ান রহমান",
    class: "শ্রেণী ১০",
    achievement: "জিপিএ ৫.০০",
    rank: "গোল্ড",
    image: "/student.png",
  },
  {
    id: 2,
    name: "নুসরাত জাহান",
    class: "শ্রেণী ৯",
    achievement: "বোর্ড স্কলারশিপ",
    rank: "সিলভার",
    image: "/student.png",
  },
  {
    id: 3,
    name: "মাহমুদ হাসান",
    class: "শ্রেণী ৮",
    achievement: "সায়েন্স অলিম্পিয়াড বিজয়ী",
    rank: "ব্রোঞ্জ",
    image: "/student.png",
  },
];

const rankIcon = {
  গোল্ড: Trophy,
  সিলভার: Medal,
  ব্রোঞ্জ: Star,
};

const rankColor = {
  গোল্ড: "text-yellow-400",
  সিলভার: "text-gray-400",
  ব্রোঞ্জ: "text-orange-400",
};

const rankBg = {
  গোল্ড: "bg-yellow-100 text-yellow-600",
  সিলভার: "bg-gray-100 text-gray-600",
  ব্রোঞ্জ: "bg-orange-100 text-orange-600",
};

export default function MeritoriousStudents() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-tr from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-clip-text text-blue-900">
            কৃতি শিক্ষার্থীবৃন্দ
          </h2>
          <p className="text-gray-600 mt-2 sm:mt-3 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
            আমাদের অসাধারণ ছাত্রছাত্রীদের বিশেষ একাডেমিক এবং অতিরিক্ত কার্যক্রমের সাফল্য উদযাপন।
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {students.map((student) => {
            const Icon = rankIcon[student.rank];
            return (
              <div
                key={student.id}
                className="relative group bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1 p-4 sm:p-6 text-center overflow-hidden border border-white/30"
              >
                {/* Rank Badge */}
                <div
                  className={`absolute top-3 sm:top-4 right-3 sm:right-4 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${rankBg[student.rank]} shadow`}
                >
                  {student.rank}
                </div>

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity bg-gradient-to-tr from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl"></div>

                {/* Avatar */}
                <div className="relative z-10">
                  <div className="mx-auto mb-3 sm:mb-4 w-16 sm:w-20 h-16 sm:h-20 rounded-full ring-4 ring-white shadow overflow-hidden">
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name & Class */}
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                    {student.name}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-500">
                    {student.class}
                  </p>

                  {/* Achievement */}
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base font-medium text-gray-700">
                    {student.achievement}
                  </p>

                  {/* Rank Icon */}
                  <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1 sm:gap-2">
                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${rankColor[student.rank]}`} />
                    <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-800">
                      {student.rank} সাফল্য
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
