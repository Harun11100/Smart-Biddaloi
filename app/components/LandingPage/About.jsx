"use client";

import { FadeInSection } from "@/app/components/LandingPage/FadeInSection";
import {
  AcademicCapIcon,
  EyeIcon,
  FlagIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export default function About() {
  return (
    <section className="scroll-smooth bg-gray-50">

      {/* Hero */}
      <section className="relative overflow-hidden bg-blue-900 text-white">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-white via-transparent to-white/0" />
        <div className="relative py-28 text-center px-4 sm:px-6 md:px-20">
          <FadeInSection>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              বারেন্ডা এফ. চাঁন একাডেমী সম্পর্কে
            </h1>
            <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-blue-100/90">
              আত্মবিশ্বাসী, দায়িত্বশীল এবং জ্ঞানী শিক্ষার্থী তৈরি করে একটি সুন্দর ভবিষ্যৎ গড়ে তোলা।
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-20">
        <FadeInSection>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-blue-800">
              আমাদের পরিচিতি
            </h2>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
              বারেন্ডা এফ. চাঁন একাডেমী একটি আধুনিক শিক্ষাপ্রতিষ্ঠান, যা একাডেমিক উৎকর্ষতা,
              নৈতিক মূল্যবোধ এবং সামগ্রিক উন্নয়নের জন্য নিবেদিত। আমরা শিক্ষার্থীদের
              সৃজনশীলতা, শৃঙ্খলা এবং বাস্তব জীবনের দক্ষতা গড়ে তোলায় বিশ্বাসী।
            </p>
          </div>
        </FadeInSection>
      </section>

      {/* Mission / Vision / Goal */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-20 bg-blue-50">
        <FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <InfoCard
              icon={<FlagIcon className="h-8 sm:h-10 w-8 sm:w-10 text-blue-600" />}
              title="আমাদের লক্ষ্য"
              text="প্রতিটি শিক্ষার্থীর জন্য শক্তিশালী একাডেমিক ভিত্তি, নৈতিক চরিত্র এবং সমালোচনামূলক চিন্তাশক্তি তৈরি করা।"
            />
            <InfoCard
              icon={<EyeIcon className="h-8 sm:h-10 w-8 sm:w-10 text-blue-600" />}
              title="আমাদের দর্শন"
              text="আজীবন শেখার অনুপ্রেরণা এবং দায়িত্বশীল বৈশ্বিক নাগরিক তৈরি করা।"
            />
            <InfoCard
              icon={<AcademicCapIcon className="h-8 sm:h-10 w-8 sm:w-10 text-blue-600" />}
              title="আমাদের লক্ষ্যবস্তু"
              text="জ্ঞান, আত্মবিশ্বাস এবং মূল্যবোধে সমৃদ্ধ শিক্ষার্থী তৈরি করা।"
            />
          </div>
        </FadeInSection>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-20">
        <FadeInSection>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 text-blue-800">
              আমাদের মূল মূল্যবোধ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ValueItem title="নিষ্ঠা ও শৃঙ্খলা" />
              <ValueItem title="সম্মান ও দায়িত্ব" />
              <ValueItem title="সৃজনশীলতা ও উদ্ভাবন" />
              <ValueItem title="একাডেমিক উৎকর্ষতা" />
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Reputation */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-20 bg-blue-100">
        <FadeInSection>
          <div className="max-w-4xl mx-auto text-center">
            <StarIcon className="h-12 sm:h-14 w-12 sm:w-14 mx-auto text-blue-500 mb-6 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-blue-900">
              আমাদের সুনাম
            </h2>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
              শৃঙ্খলাবদ্ধ পরিবেশ, যোগ্য শিক্ষক এবং চমৎকার ফলাফলের মাধ্যমে
              বারেন্ডা এফ. চাঁন একাডেমী অভিভাবকদের আস্থার প্রতীক।
            </p>
          </div>
        </FadeInSection>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-900 text-white text-center px-4 sm:px-6 md:px-20">
        <FadeInSection>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            একসাথে ভবিষ্যৎ গড়া
          </h2>
          <p className="max-w-2xl mx-auto text-blue-100 text-sm sm:text-base md:text-lg">
            বারেন্ডা এফ. চাঁন একাডেমীতে যোগ দিন এবং একটি অর্থবহ শিক্ষাজীবনের অংশ হন।
          </p>
        </FadeInSection>
      </section>

    </section>
  );
}

/* ---------- Components ---------- */

function InfoCard({ icon, title, text }) {
  return (
    <div className="group bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-blue-600">
      <div className="flex justify-center mb-4 text-blue-600">{icon}</div>
      <h3 className="text-base sm:text-lg font-semibold mb-2 text-blue-900">{title}</h3>
      <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">{text}</p>
    </div>
  );
}

function ValueItem({ title }) {
  return (
    <div className="flex items-center gap-3 p-5 rounded-lg bg-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1 border-l-4 border-blue-600">
      <span className="w-3 h-3 rounded-full bg-blue-600" />
      <h4 className="font-medium text-gray-800 text-xs sm:text-sm md:text-base">{title}</h4>
    </div>
  );
}
