"use client";

import FormModal from "@/app/components/FormModal";
import Performance from "@/app/components/Performance";
import Image from "next/image";
import Link from "next/link";

export default function StudentClient({ student }) {
  const attendanceTotal =
    student.totalPresentDays?.reduce((sum, m) => sum + (m.days || 0), 0) || 0;

  return (
    <div className="flex-1 p-6 flex flex-col gap-6 xl:flex-row bg-slate-50">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        {/* PROFILE CARD */}
        <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* AVATAR */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 p-1">
                <Image
                  src="/avatar.png"
                  alt="Student"
                  width={144}
                  height={144}
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              </div>
            </div>

            {/* INFO */}
            <div className="flex-1 flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-800">
                    {student.name}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    {student.address || "No address provided"}
                  </p>
                </div>

                <FormModal table="student" type="update" data={student} />
              </div>

              {/* CLASS BADGE */}
              <span className="inline-flex w-fit px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium">
                {student.className}
                {student.section && ` (${student.section})`}
              </span>

              {/* META */}
              <div className="grid grid-cols-2 gap-3 mt-2">
            {/* Row 1 */}
            <Info
              icon="/user.png"
              value={`Guardian: ${student.guardianName || "N/A"}`}
            />
            <Info
              icon="/phone.png"
              value={`Phone: ${student.guardianPhone || "N/A"}`}
            />

            {/* Row 2 */}
            <Info icon="/blood.png" value={student.bloodGroup} />
            <Info icon="/gender.png" value={student.gender} />
          </div>

            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatsCard title="Present Days" value={attendanceTotal} icon="/singleAttendance.png" />
          <StatsCard title="Total Paid" value={`৳${student.totalPaidAmount || 0}`} icon="/paid.png" />
          <StatsCard title="Total Due" value={`৳${student.totalDueAmount || 0}`} icon="/due.png" />
          <StatsCard
            title="Payment Status"
            value={student.paymentStatus || "Unpaid"}
            icon="/status.png"
            status
          />
          <StatsCard title="Tuition Fee" value={`৳${student.tuitionFee || 0}`} icon="/fees.png" />
          <StatsCard title="Coaching Fee" value={`৳${student.coachingFee || 0}`} icon="/coaching.png" />
        </div>
      </div>

      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <Shortcuts studentId={student._id} />
        <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl p-4 shadow-sm">
          <Performance />
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

const Info = ({ icon, value }) => (
  <div className="flex items-start gap-2 text-slate-700 bg-white rounded-xl px-3 py-2 border border-slate-200">
    <Image src={icon} alt="" width={14} height={14} className="mt-1" />
    <span className="break-all text-sm">
      {value || "N/A"}
    </span>
  </div>
);


const StatsCard = ({ icon, title, value, status }) => {
  const statusColor =
    value === "paid"
      ? "text-green-600"
      : value === "partial"
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-slate-100">
          <Image src={icon} alt="" width={20} height={20} />
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            {title}
          </p>
          <h2 className={`text-xl font-semibold ${status ? statusColor : "text-slate-800"}`}>
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
};

const Shortcuts = ({ studentId }) => (
  <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
    <h1 className="text-lg font-semibold text-slate-800 mb-4">
      Quick Actions
    </h1>

    <div className="flex flex-wrap gap-3">
      <Shortcut href={`/students/${studentId}/attendance`} label="Attendance" />
      <Shortcut href={`/students/${studentId}/fees`} label="Payment History" />
      <Shortcut href={`/students/${studentId}/profile`} label="Results" />
    </div>
  </div>
);

const Shortcut = ({ href, label }) => (
  <Link
    href={href}
    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition text-sm font-medium"
  >
    {label}
  </Link>
);
