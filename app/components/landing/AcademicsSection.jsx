import React from "react";
import { BookOpen, GraduationCap, Award, ChevronRight } from "lucide-react";

const PROGRAMS = [
  {
    title: "প্রাথমিক শাখা (১ম - ৫মি)",
    desc: "প্রাথমিক শিক্ষার ভিত্তি শক্তিশালী করতে খেলাধুলা ও আনন্দের মাধ্যমে শিক্ষা প্রদান।",
    icon: BookOpen,
    color: "from-emerald-500 to-teal-700",
  },
  {
    title: "মাধ্যমিক শাখা (৬ষ্ঠ - ১০ম)",
    desc: "বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা শাখায় সৃজনশীল পঠন-পাঠন ও নিয়মিত মূল্যায়ন।",
    icon: GraduationCap,
    color: "from-blue-600 to-indigo-800",
  },

];

export default function AcademicsSection() {
  return (
    <section id="academics" className="py-20 bg-slate-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            একাডেমিক প্রোগ্রাম
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            আমাদের শিক্ষাক্রম ও বিভাগসমূহ
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            প্রাথমিক থেকে উচ্চ মাধ্যমিক পর্যায় পর্যন্ত আধুনিক মানসম্মত শিক্ষা ব্যবস্থা।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROGRAMS.map((program, idx) => {
            const IconComp = program.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-xl transition duration-300 group hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${program.color} text-white flex items-center justify-center mb-5 shadow-md`}>
                  <IconComp size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  {program.title}
                </h3>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  {program.desc}
                </p>
                <a
                  href="#details"
                  className="mt-4 inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-900 gap-1"
                >
                  বিস্তারিত জানুন <ChevronRight size={14} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}