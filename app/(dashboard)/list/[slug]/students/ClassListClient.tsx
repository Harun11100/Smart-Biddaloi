"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ClassData {
  _id: string;
  className: string;
  sectionName?: string;
  studentCount: number;
  schoolId: string;
  guardianPhone?: string | null;
}

interface ClassListClientProps {
  classes: ClassData[];
  schoolId: string;
}

export default function ClassListClient({ classes}: ClassListClientProps) {
  const router = useRouter();
      const [schoolDetails, setSchoolDetails] = useState<{ schoolId: string } | null>(null);
      const schoolId = schoolDetails?.schoolId ?? "";

    useEffect(() => {
      const stored = localStorage.getItem("schoolDetails");
      if (stored) {
        const school = JSON.parse(stored);
        if (!school.schoolId) {
          router.push("/sign-in-as-admin");
          return;
        }
        setSchoolDetails(school);
      } else {
        router.push("/sign-in-as-admin");
      }
    }, [router]);
  

  const handleClassClick = (classId: string) => {
    router.push(`/TeacherHomework?schoolId=${schoolId}&classId=${classId}`);
  };

  if (!classes.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-indigo-50 to-gray-100">
        <p className="text-gray-500 text-lg">No classes found for this school.</p>
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
