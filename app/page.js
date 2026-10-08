'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/landing/Header";
import HeroSection from "./components/landing/HeroSection";
import AcademicsSection from "./components/landing/AcademicsSection";
import FacilitiesSection from "./components/landing/FacilitiesSection";
import MeritoriousSection from "./components/landing/MeritoriousSection";
import TeachersSection from "./components/landing/TeachersSection";
import Footer from "./components/landing/Footer";

// --- Guardian / Student Login Modal Component ---
function GuardianLoginModal({ isOpen, onClose }) {
  const [guardianPhone, setGuardianPhone] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const classes = [
    "প্লে-শ্রেণী", "নার্সারি-শ্রেণী", "প্রথম শ্রেণী", "দ্বিতীয় শ্রেণী",
    "তৃতীয় শ্রেণী", "চতুর্থ শ্রেণী", "পঞ্চম শ্রেণী", "ষষ্ঠ শ্রেণী",
    "সপ্তম শ্রেণী", "অষ্টম শ্রেণী", "নবম শ্রেণী", "দশম শ্রেণী"
  ];
  const sections = ["A", "B", "C"];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Form Validation
    if (!guardianPhone || guardianPhone.length !== 11) {
      setError("মোবাইল নম্বরটি ১১ ডিজিটের হতে হবে।");
      return;
    }
    if (!className) {
      setError("শ্রেণী নির্বাচন করুন।");
      return;
    }
    if (!rollNumber) {
      setError("রোল নম্বর প্রদান করুন।");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        guardianPhone: guardianPhone.trim(),
        rollNumber: rollNumber.trim(),
        className,
        section,
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://barendasobujkanonschool.vercel.app/";
      const res = await axios.post(`${apiUrl}/api/guardian/login`, payload);
      const student = res.data?.student;

      if (student) {
        localStorage.setItem(
          "guardianLogin",
          JSON.stringify({
            schoolId: student.schoolId,
            classId: student.classId,
            studentId: student.studentId,
            phone: student.phone,
          })
        );

        window.location.href = `/GuardianDashboardScreen?schoolId=${student.schoolId}&classId=${student.classId}&studentId=${student.studentId}&phone=${student.phone}`;
      } else {
        setError("ভুল ফোন নম্বর বা রোল নম্বর।");
      }
    } catch (err) {
      console.error("Login error:", err?.response?.data || err.message);
      setError("কিছু সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-[#E0EAFC] to-[#CFDEF3] p-6 sm:p-8 shadow-2xl transition-all border border-white/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-md">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-[#273ca5]">অভিভাবক লগইন</h3>
          <p className="text-sm font-medium text-slate-600 mt-1">আধুনিক স্কুল ব্যবস্থাপনা</p>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl bg-white/90 p-6 shadow-sm backdrop-blur-md">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-xs font-semibold text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                অভিভাবকের মোবাইল নম্বর
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <input
                  type="tel"
                  required
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="মোবাইল নম্বর লিখুন"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/80 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Class Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                শ্রেণী নির্বাচন করুন
              </label>
              <div className="flex flex-wrap gap-2">
                {classes.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setClassName(c)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                      className === c
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                        : "border-slate-300 bg-white text-slate-800 hover:border-slate-400"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                সেকশন নির্বাচন করুন (যদি থাকে)
              </label>
              <div className="flex flex-wrap gap-2">
                {sections.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSection(s)}
                    className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-all ${
                      section === s
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                        : "border-slate-300 bg-white text-slate-800 hover:border-slate-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                রোল নম্বর
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="রোল নম্বর লিখুন"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/80 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.99] disabled:opacity-70 mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>প্রসেসিং হচ্ছে...</span>
                </div>
              ) : (
                "লগইন"
              )}
            </button>
          </form>
        </div>

        {/* Modal Footer */}
        <p className="mt-6 text-center text-xs font-medium text-slate-600">
          📚 অভিভাবকের জন্য সহজ লগইন অভিজ্ঞতা
        </p>
      </div>
    </div>
  );
}

// --- Main App Component ---
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ScrollSpy logic for navigation highlighting
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white relative">
      <Header scrolled={scrolled} activeSection={activeSection} />
      <main>
        <HeroSection />
        <AcademicsSection />
        <FacilitiesSection />
        <MeritoriousSection />
        <TeachersSection />
      </main>
      <Footer />

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700 hover:shadow-xl hover:scale-105 focus:outline-none active:scale-95"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>অভিভাবক লগইন</span>
      </button>

      {/* Guardian Login Modal */}
      <GuardianLoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}