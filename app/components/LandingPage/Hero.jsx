"use client";

import { useState, useEffect } from "react";

const slides = [
  {
    image: "/image1.jpg",
    title: "বারেন্ডা এফ. চান একাডেমী",
    subtitle: "সৃজনশীলতা, জ্ঞান এবং নৈতিক মূল্যবোধের মাধ্যমে ভবিষ্যৎ প্রজন্ম গঠন।",
    cta: "ভর্তি চলছে",
  },
  {
    image: "/image2.jpg",
    title: "প্রতিটি শিক্ষার্থীর জন্য মানসম্মত শিক্ষা",
    subtitle: "আত্মবিশ্বাস ও দক্ষতার সাথে স্বপ্ন পূরণের পথে এগিয়ে চলা।",
    cta: "এখনই আবেদন করুন",
  },
  {
    image: "/image3.jpg",
    title: "আধুনিক ও সহায়ক শিক্ষার পরিবেশ",
    subtitle: "স্মার্ট ক্লাসরুম, সমৃদ্ধ লাইব্রেরি ও আধুনিক ল্যাব সুবিধা।",
    cta: "আমাদের সাথে যোগ দিন",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-[90vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* School-friendly Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/50 to-emerald-700/60"></div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-center items-center text-center px-6 sm:px-10">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg leading-tight">
              {slide.title}
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-100 mt-3 sm:mt-4 max-w-xl sm:max-w-2xl drop-shadow">
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, idx) => (
          <span
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 sm:w-4 h-3 sm:h-4 rounded-full cursor-pointer transition-all ${
              current === idx
                ? "bg-emerald-400 scale-125"
                : "bg-slate-300/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
