// /[id]/TeacherClient.js

"use client";

import Announcements from "@/app/components/Announcements";
import BigCalendar from "@/app/components/BigCalender";
import FormModal from "@/app/components/FormModal";
import Performance from "@/app/components/Performance";
import { role } from "@/app/lib/data";
import Image from "next/image";
import Link from "next/link";

export default function TeacherClients({ teacher }) {
  const attendanceTotal =
    teacher.totalPresentDays?.reduce(
      (sum, m) => sum + (m.days || 0),
      0
    ) || 0;

  return (
    <div className="flex-1 p-6 flex flex-col gap-6 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* TEACHER INFO */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-md py-6 px-6 rounded-2xl flex-1 flex gap-6 hover:shadow-xl transition-shadow duration-300">
            <div className="w-1/3 flex justify-center items-start">
              <Image
                src="/avatar.png"
                alt="Teacher"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            <div className="w-2/3 flex flex-col gap-4 justify-between">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                  {teacher.name}
                </h1>
                {role === "admin" && (
                  <FormModal table="teacher" type="update" data={teacher} />
                )}
              </div>
              <p className="text-gray-500">
                {teacher.address || "No address provided"}
              </p>
              <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
                <Info icon="/mail.png" value={teacher.email} />
                <Info icon="/phone.png" value={teacher.phone} />
                <Info icon="/blood.png" value={teacher.bloodGroup} />
                <Info icon="/gender.png" value={teacher.gender} />
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <StatsCard
              icon="/singleAttendance.png"
              title="Present Days"
              value={attendanceTotal}
              color="bg-gradient-to-tr from-green-100 to-green-200"
            />
            <StatsCard
              icon="/singleLesson.png"
              title="Subjects"
              value={teacher.subjects?.length || 0}
              color="bg-gradient-to-tr from-purple-100 to-purple-200"
            />
            <StatsCard
              icon="/singleClass.png"
              title="Class Teacher"
              value={teacher.classTeacher || "N/A"}
              color="bg-gradient-to-tr from-yellow-100 to-yellow-200"
            />
            <StatsCard
              icon="/singleBranch.png"
              title="Role"
              value={teacher.role}
              color="bg-gradient-to-tr from-pink-100 to-pink-200"
            />
          </div>
        </div>

        {/* CALENDAR */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 h-[800px]">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">
            Teacher&apos;s Schedule
          </h1>
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <Shortcuts teacherId={teacher._id} />
        <Performance />
        <Announcements />
      </div>
    </div>
  );
}

const Info = ({ icon, value }) => (
  <div className="flex items-center gap-2 text-gray-700">
    <Image src={icon} alt="" width={16} height={16} className="w-4 h-4" />
    <span>{value || "N/A"}</span>
  </div>
);

const StatsCard = ({ icon, title, value, color }) => (
  <div
    className={`flex gap-4 p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 ${color}`}
  >
    <Image src={icon} alt="" width={24} height={24} className="w-6 h-6" />
    <div>
      <h1 className="text-xl font-bold text-gray-800">{value}</h1>
      <span className="text-sm text-gray-600">{title}</span>
    </div>
  </div>
);

const Shortcuts = ({ teacherId }) => (
  <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
    <h1 className="text-xl font-semibold mb-4 text-gray-800">Shortcuts</h1>
    <div className="flex flex-wrap gap-3">
      <Link
        href={`/teachers/${teacherId}/subjects`}
        className="px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
      >
        Subjects
      </Link>
      <Link
        href={`/teachers/${teacherId}/attendance`}
        className="px-4 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors duration-200 text-sm font-medium"
      >
        Attendance
      </Link>
      <Link
        href={`/teachers/${teacherId}/lessons`}
        className="px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors duration-200 text-sm font-medium"
      >
        Lessons
      </Link>
      <Link
        href={`/teachers/${teacherId}/exams`}
        className="px-4 py-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 transition-colors duration-200 text-sm font-medium"
      >
        Exams
      </Link>
    </div>
  </div>
);
