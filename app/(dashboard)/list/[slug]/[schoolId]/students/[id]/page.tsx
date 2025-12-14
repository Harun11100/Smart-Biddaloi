// import Announcements from "@/app/components/Announcements";
// import BigCalendar from "@/app/components/BigCalender";
// import Performance from "@/app/components/Performance";
// import Image from "next/image";
// import Link from "next/link";

// const SingleStudentPage = () => {
//   return (
//     <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
//       {/* LEFT */}
//       <div className="w-full xl:w-2/3">
//         {/* TOP */}
//         <div className="flex flex-col lg:flex-row gap-4">
//           {/* USER INFO CARD */}
//           <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
//             <div className="w-1/3">
//               <Image
//                 src="https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200"
//                 alt=""
//                 width={144}
//                 // height={144}
//                 className="w-36 h-36 rounded-full object-cover"
//               />
//             </div>
//             <div className="w-2/3 flex flex-col justify-between gap-4">
//               <h1 className="text-xl font-semibold">Cameron Moran</h1>
//               <p className="text-sm text-gray-500">
//                 Lorem ipsum, dolor sit amet consectetur adipisicing elit.
//               </p>
//               <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
//                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                   <Image src="/blood.png" alt="" width={14} height={14} />
//                   <span>A+</span>
//                 </div>
//                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                   <Image src="/date.png" alt="" width={14} height={14} />
//                   <span>January 2025</span>
//                 </div>
//                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                   <Image src="/mail.png" alt="" width={14} height={14} />
//                   <span>user@gmail.com</span>
//                 </div>
//                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                   <Image src="/phone.png" alt="" width={14} height={14} />
//                   <span>+1 234 567</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* SMALL CARDS */}
//           <div className="flex-1 flex gap-4 justify-between flex-wrap">
//             {/* CARD */}
//             <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//               <Image
//                 src="/singleAttendance.png"
//                 alt=""
//                 width={24}
//                 height={24}
//                 className="w-6 h-6"
//               />
//               <div className="">
//                 <h1 className="text-xl font-semibold">90%</h1>
//                 <span className="text-sm text-gray-400">Attendance</span>
//               </div>
//             </div>
//             {/* CARD */}
//             <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//               <Image
//                 src="/singleBranch.png"
//                 alt=""
//                 width={24}
//                 height={24}
//                 className="w-6 h-6"
//               />
//               <div className="">
//                 <h1 className="text-xl font-semibold">6th</h1>
//                 <span className="text-sm text-gray-400">Grade</span>
//               </div>
//             </div>
//             {/* CARD */}
//             <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//               <Image
//                 src="/singleLesson.png"
//                 alt=""
//                 width={24}
//                 height={24}
//                 className="w-6 h-6"
//               />
//               <div className="">
//                 <h1 className="text-xl font-semibold">18</h1>
//                 <span className="text-sm text-gray-400">Lessons</span>
//               </div>
//             </div>
//             {/* CARD */}
//             <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
//               <Image
//                 src="/singleClass.png"
//                 alt=""
//                 width={24}
//                 height={24}
//                 className="w-6 h-6"
//               />
//               <div className="">
//                 <h1 className="text-xl font-semibold">6A</h1>
//                 <span className="text-sm text-gray-400">Class</span>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* BOTTOM */}
//         <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
//           <h1>Student&apos;s Schedule</h1>
//           <BigCalendar />
//         </div>
//       </div>
//       {/* RIGHT */}
//       <div className="w-full xl:w-1/3 flex flex-col gap-4">
//         <div className="bg-white p-4 rounded-md">
//           <h1 className="text-xl font-semibold">Shortcuts</h1>
//           <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
//             <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
//               Student&apos;s Lessons
//             </Link>
//             <Link className="p-3 rounded-md bg-lamaPurpleLight" href="/">
//               Student&apos;s Teachers
//             </Link>
//             <Link className="p-3 rounded-md bg-pink-50" href="/">
//               Student&apos;s Exams
//             </Link>
//             <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
//               Student&apos;s Assignments
//             </Link>
//             <Link className="p-3 rounded-md bg-lamaYellowLight" href="/">
//               Student&apos;s Results
//             </Link>
//           </div>
//         </div>
//         <Performance />
//         <Announcements />
//       </div>
//     </div>
//   );
// };

// export default SingleStudentPage;


"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

interface ClassData {
  _id: string;
  className: string;
  sectionName?: string;
  studentCount: number;
  schoolId: string;
  guardianPhone?: string | null;
}

export default function ClassListForAttendance() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const schoolId = searchParams.get("schoolId") || "";

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);


  // Normalize API data
  const normalizeClassData = (cls: any): ClassData => ({
    _id: cls._id,
    className: cls.className,
    sectionName: cls.sectionName,
    studentCount: cls.studentCount ?? 0,
    schoolId: cls.schoolId,
    guardianPhone: cls.guardianPhone ?? null,
  });

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`/api/school/class/getClass?schoolId=${schoolId}`);
      const fetchedClasses = res.data.data.map(normalizeClassData);
      setClasses(fetchedClasses);
    } catch (err) {
      console.error("Error fetching classes:", err);
      alert("Failed to fetch classes from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!schoolId) return;
    fetchClasses();
  }, [schoolId]);

  const handleClassClick = (classId: string) => {
    router.push(`/TeacherHomework?schoolId=${schoolId}&classId=${classId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-indigo-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 p-4 sm:p-6 md:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
        📚 শ্রেণী নির্বাচন করুন
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {classes.map((cls) => (
          <div
            key={cls._id}
            onClick={() => handleClassClick(cls._id)}
            className="cursor-pointer rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {cls.className} {cls.sectionName ? `(${cls.sectionName})` : ""}
                </p>
                <p className="text-sm text-gray-500 mt-1">{cls.studentCount} শিক্ষার্থী</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
