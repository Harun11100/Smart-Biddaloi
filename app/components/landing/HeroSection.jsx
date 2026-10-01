"use client";

import React, { useState, useEffect } from "react";
import { Award, ArrowRight, BookOpen, Trophy, ChevronLeft, ChevronRight } from "lucide-react";

// List of slides for the slideshow
const SLIDES = [
  {
    image: "imag.jpg", // Make sure this path exists in your /public folder
    tag: "গ্রিন ক্যাম্পাস",
    title: "আধুনিক বিজ্ঞানাগার ও কম্পিউটার ল্যাব সুবিধা",
  },
  {
    image: "/img2.jpg",
    tag: "ডিজিটাল ক্লাসরুম",
    title: "মাল্টিমিডিয়া প্রজেক্টর ও তথ্যপ্রযুক্তি নির্ভর শিক্ষা",
  },
  {
    image: "/img3.jpg", // Add any additional campus images here
    tag: "সহ-শিক্ষা কার্যক্রম",
    title: "খেলাধুলা, সংস্কৃতি ও মেধা বিকাশের উন্মুক্ত সুযোগ",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play interval for slideshow (5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/20 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
              <Award size={14} className="text-amber-400" />
              <span>শ্রেষ্ঠ শিক্ষা প্রতিষ্ঠান স্বীকৃতি ২০২৫</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              জ্ঞান, নৈতিকতা ও <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-300 bg-clip-text text-transparent">
                স্মার্ট নেতৃত্বের
              </span>{" "}
              প্রতীতি
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              বারেন্ডা সবুজ কানন স্কুল এন্ড কলেজে সুশৃঙ্খল পরিবেশ, আধুনিক ডিজিটাল ক্লাসরুম ও দক্ষ শিক্ষক মণ্ডলীর তত্ত্বাবধানে আপনার সন্তানের সুশিক্ষা ও মেধা বিকাশ নিশ্চিত করুন।
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#admission"
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition transform hover:-translate-y-1 flex items-center gap-2"
              >
                <span>অনলাইন ভর্তি আবেদন</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="#academics"
                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 transition backdrop-blur-md flex items-center gap-2"
              >
                <BookOpen size={16} className="text-emerald-400" />
                <span>কারিকুলাম ও সিলেবাস</span>
              </a>
            </div>

            {/* Quick Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-center lg:text-left">
              <div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-amber-400">৩০০+</h4>
                <p className="text-xs text-slate-400 font-medium">বর্তমান শিক্ষার্থী</p>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-emerald-400">৯৫.৮%</h4>
                <p className="text-xs text-slate-400 font-medium">পাসের হার (পাবলিক পরীক্ষা)</p>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-blue-400">২০+</h4>
                <p className="text-xs text-slate-400 font-medium">অভিজ্ঞ শিক্ষক-শিক্ষিকা</p>
              </div>
            </div>
          </div>

          {/* Right Column Showcase Banner - Image Slideshow */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 via-slate-800/40 to-amber-500/20 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl">
                
                {/* Slideshow Container */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-800 group">
                  {SLIDES.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                      
                      {/* Caption Box */}
                     
                    </div>
                  ))}

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition duration-300"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition duration-300"
                    aria-label="Next Slide"
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* Slide Indicators (Dots) */}
                  <div className="absolute top-3 right-3 z-20 flex gap-1.5 bg-slate-900/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                    {SLIDES.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === currentSlide ? "w-5 bg-amber-400" : "w-1.5 bg-white/50 hover:bg-white"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                </div>
              </div>

              {/* Floating Decorative Badge */}
              <div className="absolute -bottom-6 -left-6 bg-slate-900/90 border border-emerald-500/30 backdrop-blur-xl p-4 rounded-2xl shadow-xl hidden sm:flex items-center gap-3 z-30">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Trophy size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">গড় জিপিএ</p>
                  <p className="text-sm font-bold text-white">GPA 5.00 অর্জনের রেকর্ড</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}