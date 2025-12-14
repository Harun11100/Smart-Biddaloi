'use client';

import { useRouter } from "next/navigation";

export default function ClassListClient({ classes, slug, schoolId }) {
  const router = useRouter();

  const handleClassClick = (classId) => {
    router.push(`/list/${slug}/${schoolId}/students/studentList/${classId}`);
  };

  if (!classes.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-400 text-lg font-medium">
          No classes found of this school.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
        📚 Select a Class
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {classes.map((cls) => (
          <button
            key={cls._id}
            onClick={() => handleClassClick(cls._id)}
            className="group cursor-pointer rounded-3xl p-6 bg-white shadow-md border border-gray-100 text-left
                       transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg sm:text-xl font-semibold text-gray-900">
                  {cls.className} {cls.sectionName ? `(${cls.sectionName})` : ""}
                </p>

                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  {(cls.studentCount ?? 0)}{" "}
                  {cls.studentCount === 1 ? "student" : "students"}
                </p>

                {cls.guardianPhone && (
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Guardian: {cls.guardianPhone}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-500 group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
