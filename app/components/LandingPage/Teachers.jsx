"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

const headTeacher = {
  name: "জামাল উদ্দিন শেখ",
  gender: "male",
  experience: 22,
  imageUrl: "/male.png", // optional
};

function HeadTeacherCard({
  name,
  imageUrl,
  gender,
  designation = "প্রধান শিক্ষক",
  experience = 15,
}) {
  const avatar = imageUrl || (gender === "male" ? "/male.png" : "/female.png");

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300">
      {/* Badge */}
      <span className="absolute top-4 right-4 z-10 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 px-3 py-1 text-xs font-semibold text-white">
        ⭐ {designation}
      </span>

      <div className="p-6 text-center">
        <div className="relative mx-auto mb-5 h-28 w-28 rounded-full bg-blue-100 ring-4 ring-blue-300 overflow-hidden">
          <Image src={avatar} alt={name} fill className="object-cover" />
        </div>

        <h3 className="text-xl font-bold text-blue-900">{name}</h3>

        <p className="mt-1 text-sm font-semibold text-emerald-600">
          প্রধান শিক্ষক
        </p>

        <p className="mt-2 text-sm text-gray-600">
          {experience}+ বছরের শিক্ষাদান অভিজ্ঞতা
        </p>
      </div>

      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-emerald-500" />
    </div>
  );
}

function TeacherCard({ name, imageUrl, subjects = [], gender, experience = 5 }) {
  // Determine avatar if no imageUrl provided
  const avatar = imageUrl || (gender === "male" ? "/male.png" : "/female.png");

  return (
    <div className="group rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="p-4 sm:p-6 text-center">
        <div className="relative mx-auto mb-4 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-blue-50 ring-2 ring-blue-200 overflow-hidden">
          <Image src={avatar} alt={name} fill className="object-cover" />
        </div>

        <h3 className="text-sm sm:text-lg font-semibold text-gray-900">{name}</h3>

        <p className="text-xs sm:text-sm text-blue-700 font-medium mt-1">
          {subjects.length ? subjects.join(", ") : "Subject N/A"}
        </p>

        <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
          {experience} years experience
        </p>
      </div>

      <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-emerald-500 group-hover:opacity-100 transition-opacity rounded-b-2xl" />
    </div>
  );
}

export default function Teachers() {
  const [teacherData, setTeacherData] = useState([]);
  const [loading, setLoading] = useState(true);

  const schoolId = process.env.NEXT_PUBLIC_SCHOOL_ID;

  useEffect(() => {
    if (!schoolId) return;

    const fetchTeacherData = async () => {
      try {
        const res = await axios.get(`/api/school/getTeachers?schoolId=${schoolId}`);
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

  return (
    <section
      id="teachers"
      className="py-16 md:py-20 px-4 sm:px-6 md:px-20 bg-gradient-to-b from-blue-50 via-white to-emerald-50"
    >
      <div className="text-center mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-900">
          আমাদের শিক্ষকবৃন্দ
        </h2>
        <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          অভিজ্ঞ ও নিবেদিত শিক্ষক যারা শিক্ষার্থীদের সাফল্যের পথে এগিয়ে নিয়ে যান।
        </p>
      </div>
      {/* Head Teacher */}

      <div className="mb-16 max-w-3xl mx-auto">
        <HeadTeacherCard
          name={headTeacher.name}
          gender={headTeacher.gender}
          experience={headTeacher.experience}
          imageUrl={headTeacher.imageUrl}
        />
      </div>


      {loading ? (
        <p className="text-center text-gray-500">Loading teachers...</p>
      ) : teacherData.length === 0 ? (
        <p className="text-center text-gray-400">No teachers found.</p>
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {teacherData.map((teacher) => (
            <TeacherCard
              key={teacher._id}
              name={teacher.name}
              gender={teacher.gender}
              subjects={teacher.subjects?.filter(Boolean)}
              experience={teacher.experience}
              imageUrl={teacher.imageUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
}
