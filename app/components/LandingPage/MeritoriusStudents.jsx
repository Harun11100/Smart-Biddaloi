"use client";

import { Trophy, Medal, Star } from "lucide-react";
import { useState, useEffect } from "react";

// Icon & color mapping
const rankIcon = {
  গোল্ড: Trophy,
  সিলভার: Medal,
  ব্রোঞ্জ: Star,
};

const rankColor = {
  গোল্ড: "text-yellow-500",
  সিলভার: "text-gray-500",
  ব্রোঞ্জ: "text-orange-500",
};

const rankBg = {
  গোল্ড: "bg-yellow-100 text-yellow-700",
  সিলভার: "bg-gray-100 text-gray-700",
  ব্রোঞ্জ: "bg-orange-100 text-orange-700",
};

// Determine rank from achievementTitle
const getRank = (text = "") => {
  if (text.includes("জিপিএ ৫")) return "গোল্ড";
  if (text.includes("স্কলারশিপ")) return "সিলভার";
  return "ব্রোঞ্জ";
};

// Static dataset
const staticStudents = [
  {
    _id: "1",
    studentName: "রোহিত চৌধুরী",
    studentRoll: "12",
    batch: "Batch A",
    sessionYear: "2025",
    achievementTitle: "জিপিএ ৫ অর্জন",
    achievementName: "অভিনন্দন এবং পুরস্কার",
    image: { url: "/student1.png" },
  },
  {
    _id: "2",
    studentName: "সায়মা রহমান",
    studentRoll: "7",
    batch: "Batch B",
    sessionYear: "2025",
    achievementTitle: "স্কলারশিপ বিজয়ী",
    achievementName: "একাডেমিক এক্সেলেন্স",
    image: { url: "/student2.png" },
  },
  {
    _id: "3",
    studentName: "আলিফ হোসেন",
    studentRoll: "3",
    batch: "Batch A",
    sessionYear: "2025",
    achievementTitle: "উল্লেখযোগ্য খেলার সাফল্য",
    achievementName: "খেলাধুলার চ্যাম্পিয়ন",
    image: { url: "/student3.png" },
  },
];

export default function MeritoriousStudentsStatic() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    setTimeout(() => setStudents(staticStudents), 500);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-tr from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900">
            কৃতি শিক্ষার্থীবৃন্দ
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-2xl mx-auto">
            আমাদের অসাধারণ ছাত্রছাত্রীদের একাডেমিক এবং অতিরিক্ত কার্যক্রমের সাফল্য উদযাপন।
          </p>
        </div>

        {/* Achievement Cards */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {students.map((achieve) => {
            const rank = getRank(achieve.achievementTitle);
            const Icon = rankIcon[rank];
            const imageUrl = achieve.image?.url || "/student.png";

            return (
              <div
                key={achieve._id}
                className="relative group bg-white/70 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1 p-6 text-center border border-white/30 overflow-hidden"
              >
                {/* Rank Badge */}
                <div
                  className={`absolute overflow-auto top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${rankBg[rank]} shadow z-20`}
                >
                  {rank}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity bg-gradient-to-tr from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                  {/* Larger Avatar */}
                  <div className="w-60 h-40 rounded-xl ring-6 ring-white shadow overflow-hidden mb-3">
                    <img
                      src={imageUrl}
                      alt={achieve.studentName || "Student"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-semibold text-gray-800">{achieve.studentName}</h3>

                  {/* Roll / Batch */}
                  <p className="text-sm text-gray-500">
                    রোল: {achieve.studentRoll} | শ্রেণী: {achieve.batch}
                  </p>

                  {/* Achievement Title & Name */}
                  <p className="mt-2 text-sm font-medium text-gray-700">{achieve.achievementTitle}</p>
                  <p className="text-sm text-gray-600">{achieve.achievementName}</p>

                  {/* Rank Icon */}
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <Icon className={`h-6 w-6 ${rankColor[rank]}`} />
                    <span className="text-sm font-semibold text-gray-800">{rank} সাফল্য</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// "use client";

// import { Trophy, Medal, Star } from "lucide-react";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const rankIcon = {
//   গোল্ড: Trophy,
//   সিলভার: Medal,
//   ব্রোঞ্জ: Star,
// };

// const rankColor = {
//   গোল্ড: "text-yellow-500",
//   সিলভার: "text-gray-500",
//   ব্রোঞ্জ: "text-orange-500",
// };

// const rankBg = {
//   গোল্ড: "bg-yellow-100 text-yellow-700",
//   সিলভার: "bg-gray-100 text-gray-700",
//   ব্রোঞ্জ: "bg-orange-100 text-orange-700",
// };

// // Determine rank from achievementTitle
// const getRank = (text = "") => {
//   if (text.includes("জিপিএ ৫")) return "গোল্ড";
//   if (text.includes("স্কলারশিপ")) return "সিলভার";
//   return "ব্রোঞ্জ";
// };

// export default function MeritoriousStudents() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const schoolId = process.env.NEXT_PUBLIC_SCHOOL_ID;

//   useEffect(() => {
//     if (!schoolId) {
//       setError("School ID is missing");
//       setLoading(false);
//       return;
//     }

//     const fetchAchievements = async () => {
//       try {
//         const res = await axios.get(
//           `/api/school/achivement/getAchievement?schoolId=${schoolId}`
//         );

//         if (res.data?.success) {
//           setStudents(res.data.achievements || []);
//         } else {
//           setError(res.data?.message || "No achievements found");
//         }
//       } catch (err) {
//         console.error("Error fetching achievements:", err);
//         setError("Failed to fetch achievements");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAchievements();
//   }, [schoolId]);

//   return (
//     <section className="py-16 bg-gradient-to-tr from-blue-50 via-white to-indigo-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900">
//             কৃতি শিক্ষার্থীবৃন্দ
//           </h2>
//           <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-2xl mx-auto">
//             আমাদের অসাধারণ ছাত্রছাত্রীদের একাডেমিক এবং অতিরিক্ত কার্যক্রমের সাফল্য উদযাপন।
//           </p>
//         </div>

//         {/* Loading */}
//         {loading && <p className="text-center text-gray-500">Loading achievements...</p>}

//         {/* Error */}
//         {!loading && error && <p className="text-center text-red-500">{error}</p>}

//         {/* No achievements */}
//         {!loading && !error && students.length === 0 && (
//           <p className="text-center text-gray-500">কোনও কৃতি শিক্ষার্থী পাওয়া যায়নি।</p>
//         )}

//         {/* Achievement Cards */}
//         {!loading && !error && students.length > 0 && (
//           <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
//             {students.map((achieve) => {
//               const rank = getRank(achieve.achievementTitle);
//               const Icon = rankIcon[rank];
//               const imageUrl = achieve.image?.url || "/student.png";

//               return (
//                 <div
//                   key={achieve._id}
//                   className="relative group bg-white/70 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1 p-6 text-center border border-white/30 overflow-hidden"
//                 >
//                   {/* Rank Badge */}
//                   <div
//                     className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${rankBg[rank]} shadow`}
//                   >
//                     {rank}
//                   </div>

//                   {/* Hover Overlay */}
//                   <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity bg-gradient-to-tr from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl" />

//                   {/* Content */}
//                   <div className="relative z-10 flex flex-col items-center">
//                     {/* Avatar */}
//                     <div className="w-24 h-24 rounded-full ring-4 ring-white shadow overflow-hidden mb-3">
//                       <img
//                         src={imageUrl}
//                         alt={achieve.studentName || "Student"}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>

//                     {/* Name */}
//                     <h3 className="text-lg font-semibold text-gray-800">{achieve.studentName || "নাম N/A"}</h3>

//                     {/* Roll / Batch */}
//                     <p className="text-sm text-gray-500">
//                       {achieve.studentRoll ? `রোল: ${achieve.studentRoll}` : "রোল N/A"} |{" "}
//                       {achieve.batch ? `শ্রেণী: ${achieve.batch}` : "শ্রেণী N/A"}
//                     </p>

//                     {/* Achievement Title */}
//                     <p className="mt-2 text-sm font-medium text-gray-700">{achieve.achievementTitle}</p>

//                     {/* Achievement Name */}
//                     <p className="text-sm text-gray-600">{achieve.achievementName}</p>

//                     {/* Rank Icon */}
//                     <div className="mt-3 flex items-center justify-center gap-2">
//                       <Icon className={`h-5 w-5 ${rankColor[rank]}`} />
//                       <span className="text-sm font-semibold text-gray-800">{rank} সাফল্য</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
