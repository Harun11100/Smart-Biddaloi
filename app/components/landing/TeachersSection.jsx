"use client";

import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Search, GraduationCap, Award, BookOpen, UserCheck, Sparkles } from "lucide-react";

// Default Head Teacher Fallback if API hasn't loaded or doesn't specify
const defaultHeadTeacher = {
  name: "মনোয়ারুল ইসলাম",
  gender: "male",
  experience: 22,
  designation: "প্রধান শিক্ষক",
  imageUrl: "/male.png",
  subjects: ["English"],
};

// Bengali Number Converter Helper
const toBengaliNumber = (num) => {
  if (num === undefined || num === null) return "";
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num.toString().replace(/\d/g, (digit) => bengaliDigits[digit]);
};

function HeadTeacherCard({ teacher }) {
  const {
    name = "মনোয়ারুল ইসলাম",
    imageUrl,
    gender = "male",
    designation = "প্রধান শিক্ষক",
    experience = 15,
    subjects = [],
  } = teacher || {};

  const avatar = imageUrl || (gender === "male" ? "/male.png" : "/female.png");

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-emerald-50/30 to-blue-50/50 p-6 md:p-8 border border-blue-200/80 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl group-hover:bg-emerald-400/30 transition-all duration-500" />
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl group-hover:bg-blue-400/30 transition-all duration-500" />

      {/* Principal Badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 px-4 py-1.5 text-xs font-bold text-white shadow-md">
        <Sparkles size={14} className="text-amber-300 animate-pulse" />
        <span>{designation}</span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
        {/* Avatar Container */}
        <div className="relative flex-shrink-0">
          <div className="relative h-32 w-32 md:h-36 md:w-36 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-600 p-1 shadow-lg group-hover:scale-105 transition-transform duration-300">
            <div className="relative h-full w-full rounded-full overflow-hidden bg-white">
              <Image
                src={avatar}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 128px, 144px"
              />
            </div>
          </div>
          <div className="absolute bottom-1 right-1 rounded-full bg-emerald-500 p-1.5 text-white ring-4 ring-white shadow-md">
            <Award size={16} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center md:text-left flex-1 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold">
            <UserCheck size={14} />
            <span>প্রতিষ্ঠান প্রধান</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-extrabold text-blue-950 tracking-tight">
            {name}
          </h3>

          <p className="text-sm font-semibold text-emerald-700 flex items-center justify-center md:justify-start gap-1">
            <GraduationCap size={16} />
            <span>{experience ? `${toBengaliNumber(experience)}+ বছরের শিক্ষাদান ও প্রশাসনিক অভিজ্ঞতা` : "অভিজ্ঞ শিক্ষাবিদ"}</span>
          </p>

          {subjects && subjects.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1.5 justify-center md:justify-start">
              {subjects.map((sub, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-blue-100/70 border border-blue-200/60 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                >
                  {sub}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Decorative Gradient Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600" />
    </div>
  );
}

function TeacherCard({ teacher }) {
  const { name, imageUrl, subjects = [], gender, experience } = teacher;

  const avatar = imageUrl || (gender === "female" ? "/female.png" : "/male.png");

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
      {/* Top Background Pattern */}
      <div className="h-16 bg-gradient-to-r from-blue-900/10 via-emerald-800/10 to-teal-900/10 group-hover:from-blue-600 group-hover:to-emerald-600 transition-all duration-500" />

      <div className="px-4 pb-5 pt-0 -mt-10 text-center flex-1 flex flex-col items-center">
        {/* Avatar */}
        <div className="relative mb-3 h-20 w-20 sm:h-22 sm:w-22 rounded-full bg-white p-1 ring-4 ring-slate-100 shadow-md group-hover:ring-emerald-200 group-hover:scale-105 transition-all duration-300">
          <div className="relative h-full w-full rounded-full overflow-hidden bg-slate-100">
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, 88px"
            />
          </div>
        </div>

        {/* Name */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1">
          {name}
        </h3>

        {/* Subjects Badges */}
        <div className="mt-2 flex flex-wrap justify-center gap-1 min-h-[32px] items-center">
          {subjects && subjects.length > 0 ? (
            subjects.map((sub, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] sm:text-xs font-semibold text-blue-700 border border-blue-100"
              >
                <BookOpen size={10} className="text-blue-500" />
                {sub}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">বিষয় নির্দিষ্ট নয়</span>
          )}
        </div>

        {/* Experience Info */}
        {experience !== undefined && experience !== null && (
          <p className="mt-3 text-[11px] sm:text-xs font-medium text-slate-500 flex items-center gap-1">
            <span>🎓</span>
            <span>{toBengaliNumber(experience)} বছরের অভিজ্ঞতা</span>
          </p>
        )}
      </div>

      {/* Card Accent Footer */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

// Skeleton Loader
function TeacherSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white border border-slate-100 p-5 text-center flex flex-col items-center">
      <div className="h-20 w-20 rounded-full bg-slate-200 mb-3" />
      <div className="h-4 w-28 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-20 bg-slate-100 rounded mb-3" />
      <div className="h-3 w-16 bg-slate-100 rounded" />
    </div>
  );
}

export default function Teachers() {
  const [teacherData, setTeacherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const schoolId = process.env.NEXT_PUBLIC_SCHOOL_ID;

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        // Fallback for development if env is missing
        const targetSchoolId = schoolId || "default"; 
        const res = await axios.get(`/api/school/getTeachers?schoolId=${targetSchoolId}`);
        if (res.data?.success) {
          setTeacherData(res.data.teachers || []);
        }
      } catch (err) {
        console.error("Error fetching teacher data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [schoolId]);

  // Extract Head Teacher dynamic or default
  const headTeacher = useMemo(() => {
    if (!teacherData || teacherData.length === 0) return defaultHeadTeacher;

    const foundHead = teacherData.find(
      (t) =>
        t.designation?.toLowerCase().includes("head") ||
        t.designation?.toLowerCase().includes("principal") ||
        t.designation?.includes("প্রধান শিক্ষক") ||
        t.isHeadTeacher === true
    );

    return foundHead || teacherData[0] || defaultHeadTeacher;
  }, [teacherData]);

  // Filter Regular Teachers
  const regularTeachers = useMemo(() => {
    return teacherData.filter((t) => t._id !== headTeacher._id);
  }, [teacherData, headTeacher]);

  // Dynamic Subject Filters List
  const availableSubjects = useMemo(() => {
    const subjectsSet = new Set();
    teacherData.forEach((t) => {
      t.subjects?.forEach((sub) => {
        if (sub && sub.trim()) subjectsSet.add(sub.trim());
      });
    });
    return Array.from(subjectsSet);
  }, [teacherData]);

  // Filtered List based on Search and Selected Subject Pill
  const filteredTeachers = useMemo(() => {
    return regularTeachers.filter((teacher) => {
      const matchesSearch =
        teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.subjects?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSubject =
        selectedSubject === "all" ||
        teacher.subjects?.includes(selectedSubject);

      return matchesSearch && matchesSubject;
    });
  }, [regularTeachers, searchQuery, selectedSubject]);

  return (
    <section
      id="teachers"
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-slate-50 via-white to-blue-50/40 relative overflow-hidden"
    >
      {/* Background Decorative Blur Circles */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold tracking-wide">
            👨‍🏫 আমাদের গুণী শিক্ষকবৃন্দ
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            দক্ষ ও নিবেদিতপ্রাণ <span className="bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">শিক্ষকমণ্ডলী</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            শিক্ষার্থীদের সুশিক্ষা, চারিত্রিক বিকাশ ও উজ্জ্বল ভবিষ্যৎ গঠনে আমাদের অভিজ্ঞ শিক্ষকমণ্ডলী নিরলস কাজ করে যাচ্ছেন।
          </p>
        </div>

        {/* Head Teacher Section */}
        <div className="max-w-3xl mx-auto">
          <HeadTeacherCard teacher={headTeacher} />
        </div>

        {/* Search & Subject Filter Bar */}
        <div className="space-y-4 max-w-4xl mx-auto bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="শিক্ষকের নাম বা বিষয় খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition-all"
              />
            </div>

            {/* Subject Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedSubject("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSubject === "all"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                সকল বিষয়
              </button>
              {availableSubjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSubject === subject
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Regular Teachers Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <TeacherSkeleton key={i} />
            ))}
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/60 max-w-md mx-auto">
            <p className="text-slate-500 font-medium text-sm">কোনো শিক্ষকের তথ্য পাওয়া যায়নি।</p>
            {(searchQuery || selectedSubject !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubject("all");
                }}
                className="mt-3 text-xs text-emerald-600 hover:underline font-semibold"
              >
                ফিল্টার রিসেট করুন
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredTeachers.map((teacher) => (
              <TeacherCard key={teacher._id || teacher.name} teacher={teacher} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}