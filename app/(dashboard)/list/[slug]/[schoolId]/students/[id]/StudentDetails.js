"use client";

import Announcements from "@/app/components/Announcements";
import BigCalendar from "@/app/components/BigCalender";
import FormModal from "@/app/components/FormModal";
import Performance from "@/app/components/Performance";
import Image from "next/image";
import Link from "next/link";

export default function StudentClient({ student }) {
  const attendanceTotal =
    student.totalPresentDays?.reduce((sum, m) => sum + (m.days || 0), 0) || 0;

  return (
    <div className="flex-1 p-6 flex flex-col gap-6 xl:flex-row">
      {/* LEFT SECTION */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        {/* STUDENT INFO & STATS */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* STUDENT CARD */}
          <div className="bg-gradient-to-tr from-blue-50 to-blue-100 shadow-lg rounded-3xl flex flex-col lg:flex-row gap-6 p-6 hover:shadow-2xl transition-all duration-300">
            {/* AVATAR */}
            <div className="w-full lg:w-1/3 flex justify-center items-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-300 to-blue-500 blur opacity-30"></div>
                <Image
                  src="/avatar.png"
                  alt="Student"
                  width={144}
                  height={144}
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
                />
              </div>
            </div>

            {/* INFO */}
            <div className="w-full lg:w-2/3 flex flex-col justify-between gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                <FormModal table="student" type="update" data={student} />
              </div>

              {/* CLASS BADGE */}
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-300 to-blue-500 text-white text-sm font-semibold shadow-md">
                {student.className} {student.section ? `(${student.section})` : ""}
              </span>

              <p className="text-gray-600">{student.address || "No address provided"}</p>

              <div className="flex flex-wrap gap-3 mt-2">
                <Info icon="/mail.png" value={student.email || "N/A"} />
                <Info icon="/phone.png" value={student.guardianPhone || "N/A"} />
                <Info icon="/blood.png" value={student.bloodGroup || "N/A"} />
                <Info icon="/gender.png" value={student.gender || "N/A"} />
              </div>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <StatsCard
            icon="/singleAttendance.png"
            title="Present Days"
            value={attendanceTotal}
            color="bg-gradient-to-tr from-green-100 to-green-200"
          />
          <StatsCard
            icon="/paid.png"
            title="Total Paid"
            value={`$${student.totalPaidAmount || 0}`}
            color="bg-gradient-to-tr from-purple-100 to-purple-200"
          />
          <StatsCard
            icon="/due.png"
            title="Total Due"
            value={`$${student.totalDueAmount || 0}`}
            color="bg-gradient-to-tr from-red-100 to-red-200"
          />
          <StatsCard
            icon="/class1.png"
            title="Class"
            value={`${student.className} ${student.section ? `(${student.section})` : ""}`}
            color="bg-gradient-to-tr from-pink-100 to-pink-200"
          />
          <StatsCard
            icon="/fees.png"
            title="Tuition Fee"
            value={`$${student.tuitionFee || 0}`}
            color="bg-gradient-to-tr from-yellow-100 to-yellow-200"
          />
          <StatsCard
            icon="/coaching.png"
            title="Coaching Fee"
            value={`$${student.coachingFee || 0}`}
            color="bg-gradient-to-tr from-indigo-100 to-indigo-200"
          />
          <StatsCard
            icon="/absent.png"
            title="Monthly Absent"
            value={student.monthlyAbsent || 0}
            color="bg-gradient-to-tr from-gray-100 to-gray-200"
          />
          <StatsCard
            icon="/status.png"
            title="Payment Status"
            value={student.paymentStatus || "unpaid"}
            color={`${
              student.paymentStatus === "paid"
                ? "bg-gradient-to-tr from-green-100 to-green-200"
                : student.paymentStatus === "partial"
                ? "bg-gradient-to-tr from-yellow-100 to-yellow-200"
                : "bg-gradient-to-tr from-red-100 to-red-200"
            }`}
          />
        </div>

        {/* ATTENDANCE CALENDAR */}
        {/* <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 mt-6 h-[800px]">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            Student&apos;s Attendance
          </h1>
          <BigCalendar />
        </div> */}
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <Shortcuts studentId={student._id} />
        <Performance />
        <Announcements />
      </div>
    </div>
  );
}

// INFO COMPONENT
const Info = ({ icon, value }) => (
  <div className="flex items-center gap-2 text-gray-700 bg-white px-3 py-1 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
    <Image src={icon} alt="" width={16} height={16} className="w-4 h-4" />
    <span className="text-gray-800">{value || "N/A"}</span>
  </div>
);

// MODERN STATS CARD COMPONENT
const StatsCard = ({ icon, title, value, color }) => (
  <div
    className={`relative flex flex-col justify-between p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-1 ${color}`}
  >
    {/* Floating Icon */}
    <div className="absolute -top-5 left-5 bg-white rounded-full p-3 shadow-md flex items-center justify-center w-12 h-12">
      <Image src={icon} alt={title} width={32} height={32} className="w-8 h-8" />
    </div>

    {/* Content */}
    <div className="mt-12">
      <h2 className="text-gray-700 font-medium text-sm uppercase tracking-wide">{title}</h2>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>

    {/* Optional progress bar */}
    <div className="w-full bg-white/30 h-1 rounded-full mt-4 overflow-hidden">
      <div
        className="bg-white h-1 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(parseInt(value), 100)}%` }}
      />
    </div>
  </div>
);

// SHORTCUT LINKS
const Shortcuts = ({ studentId }) => (
  <div className="bg-white p-5 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300">
    <h1 className="text-xl font-semibold mb-4 text-gray-900">Shortcuts</h1>
    <div className="flex flex-wrap gap-3">
      <Link
        href={`/students/${studentId}/attendance`}
        className="px-4 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors duration-200 text-sm font-medium"
      >
        Attendance
      </Link>
      <Link
        href={`/students/${studentId}/fees`}
        className="px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors duration-200 text-sm font-medium"
      >
        Fees
      </Link>
      <Link
        href={`/students/${studentId}/exams`}
        className="px-4 py-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 transition-colors duration-200 text-sm font-medium"
      >
        Exams
      </Link>
      <Link
        href={`/students/${studentId}/profile`}
        className="px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
      >
        Profile
      </Link>
    </div>
  </div>
);
