"use client";

import { GraduationCap, BookOpen, School } from "lucide-react";

/* Custom School Card */
function SchoolCard({ Icon, title, description }) {
  return (
    <div className="group relative h-full rounded-2xl border border-blue-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
      {/* Top accent */}
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

const programs = [
  {
    title: "প্রাথমিক শিক্ষা",
    description:
      "জ্ঞানার্জন, নৈতিকতা ও মৌলিক দক্ষতার ওপর গুরুত্ব দিয়ে শিক্ষার শক্ত ভিত্তি গড়ে তোলা।",
    Icon: BookOpen,
  },
  {
    title: "মাধ্যমিক শিক্ষা",
    description:
      "বিষয়ভিত্তিক দক্ষতা ও আধুনিক শিক্ষাদানের মাধ্যমে শিক্ষার্থীদের সামগ্রিক বিকাশ।",
    Icon: School,
  },
  {
    title: "উচ্চ মাধ্যমিক শিক্ষা",
    description:
      "বিশ্ববিদ্যালয় ও ভবিষ্যৎ ক্যারিয়ারের জন্য উন্নত একাডেমিক প্রস্তুতি।",
    Icon: GraduationCap,
  },
];

export default function Academics() {
  return (
    <section
      id="academics"
      className="py-16 px-4 sm:px-6 md:px-16 bg-gradient-to-b from-blue-50 via-white to-emerald-50"
    >
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-blue-900">
          একাডেমিক প্রোগ্রামসমূহ
        </h2>
        <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
          একটি সুষম ও মানসম্মত পাঠ্যক্রম যা শিক্ষার্থীদের জ্ঞান, দক্ষতা ও মূল্যবোধ
          বিকাশে সহায়তা করে।
        </p>
      </div>

      {/* Cards */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((program) => (
          <SchoolCard
            key={program.title}
            Icon={program.Icon}
            title={program.title}
            description={program.description}
          />
        ))}
      </div>
    </section>
  );
}
