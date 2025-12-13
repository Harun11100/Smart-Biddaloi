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

export default function ClassList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const schoolId = searchParams.get("schoolId") || "";

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
      const res = await axios.get(`${API_URL}/api/school/class/getClass?schoolId=${schoolId}`);
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
