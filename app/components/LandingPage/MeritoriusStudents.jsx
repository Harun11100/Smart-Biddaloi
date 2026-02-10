"use client";

import { Trophy, Medal, Star } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

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

// 🔍 Determine rank from achievement text
const getRank = (text = "") => {
  if (text.includes("জিপিএ ৫")) return "গোল্ড";
  if (text.includes("স্কলারশিপ")) return "সিলভার";
  return "ব্রোঞ্জ";
};

export default function MeritoriousStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const schoolId = process.env.NEXT_PUBLIC_SCHOOL_ID;

  useEffect(() => {
    if (!schoolId) {
      setError("School ID is missing");
      setLoading(false);
      return;
    }

    const fetchAchievements = async () => {
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

    fetchAchievements();
  }, [schoolId]);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-tr from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-900">
            কৃতি শিক্ষার্থীবৃন্দ
          </h2>
          <p className="text-gray-600 mt-2 sm:mt-3 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
            আমাদের অসাধারণ ছাত্রছাত্রীদের বিশেষ একাডেমিক এবং অতিরিক্ত কার্যক্রমের সাফল্য উদযাপন।
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">Loading achievements...</p>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {/* No achievements */}
        {!loading && !error && students.length === 0 && (
          <p className="text-center text-gray-500">কোনও কৃতি শিক্ষার্থী পাওয়া যায়নি।</p>
        )}

        {/* Cards */}
        {!loading && !error && students.length > 0 && (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {students.map((student) => {
              const rank = getRank(student.achievementTitle);
              const Icon = rankIcon[rank];
              const imageUrl = student.image?.url || "/student.png";

              return (
                <div
                  key={student._id}
                  className="relative group bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1 p-4 sm:p-6 text-center overflow-hidden border border-white/30"
                >
                  {/* Rank Badge */}
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${rankBg[rank]} shadow`}
                  >
                    {rank}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity bg-gradient-to-tr from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl" />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Avatar */}
                    <div className="mx-auto mb-4 w-20 h-20 rounded-full ring-4 ring-white shadow overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={student.studentName || "Student"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-semibold text-gray-800">
                      {student.studentName || "নাম N/A"}
                    </h3>

                    {/* Class / Batch */}
                    <p className="text-sm text-gray-500">
                      {student.batch || "শ্রেণী N/A"}
                    </p>

                    {/* Achievement */}
                    <p className="mt-3 text-sm font-medium text-gray-700">
                      {student.achievementTitle || "সাফল্য N/A"}
                    </p>

                    {/* Rank Icon */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <Icon className={`h-5 w-5 ${rankColor[rank]}`} />
                      <span className="text-sm font-semibold text-gray-800">
                        {rank} সাফল্য
                      </span>
                    </div>
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
