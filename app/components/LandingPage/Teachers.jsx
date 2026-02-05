"use client";

import Image from "next/image";

const demoTeachers = [
  { id: "1", name: "রাফিকুল ইসলাম", subject: "গণিত", experience: "৮ বছরের অভিজ্ঞতা", image: "/male.png" },
  { id: "2", name: "সালমা আক্তার", subject: "বিজ্ঞান", experience: "৫ বছরের অভিজ্ঞতা", image: "/female.png" },
  { id: "3", name: "মাহবুবুর রহমান", subject: "ইংরেজি", experience: "৬ বছরের অভিজ্ঞতা", image: "/male.png" },
  { id: "4", name: "ফারহানা হোসেন", subject: "কলা", experience: "৭ বছরের অভিজ্ঞতা", image: "/female.png" },
  { id: "5", name: "জাহিদুল ইসলাম", subject: "তথ্যপ্রযুক্তি", experience: "৯ বছরের অভিজ্ঞতা", image: "/male.png" },
  { id: "6", name: "মমতা চক্রবর্তী", subject: "বাংলা", experience: "৬ বছরের অভিজ্ঞতা", image: "/female.png" },
  { id: "7", name: "আবু তাহের", subject: "পদার্থবিজ্ঞান", experience: "১০ বছরের অভিজ্ঞতা", image: "/male.png" },
  { id: "8", name: "সারা পারভীন", subject: "রসায়ন", experience: "৭ বছরের অভিজ্ঞতা", image: "/female.png" },
];

/* Custom Teacher Card */
function TeacherCard({ name, subject, experience, image }) {
  return (
    <div className="group rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="p-4 sm:p-6 text-center">
        {/* Avatar */}
        <div className="relative mx-auto mb-4 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-blue-50 ring-2 ring-blue-200 group-hover:ring-blue-600 transition">
          <Image
            src={image}
            alt={name}
            fill
            className="rounded-full object-cover"
          />
        </div>

        {/* Info */}
        <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
          {name}
        </h3>

        <p className="text-xs sm:text-sm text-blue-700 font-medium mt-1">
          {subject}
        </p>

        <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
          {experience}
        </p>
      </div>

      {/* Bottom Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl" />
    </div>
  );
}

export default function Teachers() {
  return (
    <section
      id="teachers"
      className="py-16 md:py-20 px-4 sm:px-6 md:px-20 bg-gradient-to-b from-blue-50 via-white to-emerald-50"
    >
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-900">
          আমাদের শিক্ষকবৃন্দ
        </h2>
        <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          অভিজ্ঞ ও নিবেদিত শিক্ষক যারা শিক্ষার্থীদের সাফল্যের পথে এগিয়ে নিয়ে যান।
        </p>
      </div>

      {/* Cards Grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {demoTeachers.map((teacher) => (
          <TeacherCard key={teacher.id} {...teacher} />
        ))}
      </div>
    </section>
  );
}
