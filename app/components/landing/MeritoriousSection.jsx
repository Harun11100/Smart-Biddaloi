"use client";

import { Trophy, Medal, Star, Sparkles, User, AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const RANK_CONFIG = {
  গোল্ড: {
    icon: Trophy,
    gradient: "from-amber-400 to-amber-600",
    textGradient: "from-amber-500 to-amber-700",
    bgLight: "bg-amber-500/10 text-amber-800 border-amber-200/60",
    ring: "ring-amber-400/50",
    glow: "shadow-amber-500/20",
    badgeIcon: "text-amber-500",
  },
  সিলভার: {
    icon: Medal,
    gradient: "from-slate-300 to-slate-500",
    textGradient: "from-slate-600 to-slate-800",
    bgLight: "bg-slate-500/10 text-slate-800 border-slate-200/60",
    ring: "ring-slate-300/50",
    glow: "shadow-slate-500/20",
    badgeIcon: "text-slate-500",
  },
  ব্রোঞ্জ: {
    icon: Star,
    gradient: "from-orange-400 to-amber-700",
    textGradient: "from-orange-600 to-amber-800",
    bgLight: "bg-orange-500/10 text-orange-800 border-orange-200/60",
    ring: "ring-orange-400/50",
    glow: "shadow-orange-500/20",
    badgeIcon: "text-orange-500",
  },
};

// Determine rank from achievementTitle
const getRank = (text = "") => {
  if (text.includes("জিপিএ ৫") || text.includes("বৃত্তি")) return "গোল্ড";
  if (text.includes("স্কলারশিপ")) return "সিলভার";
  return "ব্রোঞ্জ";
};

export default function MeritoriousStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const schoolId = process.env.NEXT_PUBLIC_SCHOOL_ID;

  const fetchAchievements = async () => {
    if (!schoolId) {
      setError("School ID is missing");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `/api/school/achivement/getAchievement?schoolId=${schoolId}`
      );

      if (res.data?.success) {
        setStudents(res.data.achievements || []);
      } else {
        setError(res.data?.message || "No achievements found");
      }
    } catch (err) {
      console.error("Error fetching achievements:", err);
      setError("Failed to fetch achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [schoolId]);

  return (
    <section id="meritorious" className="relative py-20 overflow-hidden bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-50">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-200/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-200/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-xs">
            <Sparkles size={14} className="text-amber-500 animate-pulse" />
            <span>কৃতিত্ব ও গৌরব</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            আমাদের{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-600 bg-clip-text text-transparent">
              কৃতি শিক্ষার্থীবৃন্দ
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            আমাদের অসাধারণ ছাত্রছাত্রীদের একাডেমি এবং অতিরিক্ত সহ-শিক্ষা কার্যক্রমের গৌরবময় সাফল্য উদযাপন।
          </p>
        </div>

        {/* Loading State Skeleton Grid */}
        {loading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-6 rounded-3xl bg-white/60 border border-slate-200/80 shadow-xs animate-pulse flex flex-col items-center space-y-4"
              >
                <div className="w-24 h-24 rounded-full bg-slate-200/80" />
                <div className="h-5 w-32 bg-slate-200/80 rounded-md" />
                <div className="h-4 w-24 bg-slate-200/60 rounded-md" />
                <div className="h-10 w-full bg-slate-200/50 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3">
            <AlertCircle className="mx-auto h-8 w-8 text-rose-500" />
            <p className="text-sm font-semibold text-rose-800">{error}</p>
            <button
              onClick={fetchAchievements}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
            >
              <RefreshCw size={14} /> পুনরায় চেষ্টা করুন
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && students.length === 0 && (
          <div className="text-center py-16 px-4 bg-white/50 backdrop-blur-md rounded-3xl border border-slate-200/60 max-w-lg mx-auto">
            <User className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <p className="text-slate-600 font-medium">কোনও কৃতি শিক্ষার্থী পাওয়া যায়নি।</p>
          </div>
        )}

        {/* Achievement Cards Grid */}
        {!loading && !error && students.length > 0 && (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {students.map((achieve) => {
              const rankKey = getRank(achieve.achievementTitle);
              const rankInfo = RANK_CONFIG[rankKey] || RANK_CONFIG["ব্রোঞ্জ"];
              const RankIcon = rankInfo.icon;
              const imageUrl = achieve.image?.url;

              return (
                <div
                  key={achieve._id}
                  className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:${rankInfo.glow} transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden`}
                >
                  {/* Decorative Subtle Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-slate-50/50 opacity-60 pointer-events-none" />

                  {/* Card Header Top Badges */}
                  <div className="relative z-10 flex items-center justify-between w-full mb-4">
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                      {achieve.batch ? `শ্রেণী: ${achieve.batch}` : "কৃতি শিক্ষার্থী"}
                    </span>

                    {/* Rank Badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border shadow-xs ${rankInfo.bgLight}`}
                    >
                      <RankIcon size={14} className={rankInfo.badgeIcon} />
                      <span>{rankKey}</span>
                    </div>
                  </div>

                  {/* Main Profile Info */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    
                    {/* Avatar Ring Frame */}
                    <div className="relative mb-4">
                      <div
                        className={`w-28 h-28 rounded-full p-1 bg-gradient-to-tr ${rankInfo.gradient} shadow-md ring-4 ring-white/80 overflow-hidden group-hover:scale-105 transition-transform duration-300`}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={achieve.studentName || "Student"}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded-full text-slate-400">
                            <User size={36} />
                          </div>
                        )}
                      </div>

                      {/* Floating Rank Badge Marker */}
                      <div
                        className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-tr ${rankInfo.gradient} text-white flex items-center justify-center shadow-md border-2 border-white`}
                      >
                        <RankIcon size={16} />
                      </div>
                    </div>

                    {/* Student Name */}
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {achieve.studentName || "নাম উল্লেখ নেই"}
                    </h3>

                    {/* Roll & Class Info */}
                    <p className="text-xs font-medium text-slate-500 mt-1">
                      {achieve.studentRoll ? `রোল: ${achieve.studentRoll}` : "রোল N/A"}
                    </p>

                    {/* Achievement Details Box */}
                    <div className="w-full mt-5 pt-4 border-t border-slate-100 space-y-1.5 bg-slate-50/50 p-3.5 rounded-2xl">
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">
                        {achieve.achievementTitle}
                      </p>
                      {achieve.achievementName && (
                        <p className="text-xs font-medium text-slate-600 line-clamp-2">
                          {achieve.achievementName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Decorative Footer */}
                  <div className="relative z-10 mt-4 flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400">
                    <Sparkles size={12} className="text-amber-400" />
                    <span>সাফল্যের গৌরবময় মুহূর্ত</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}