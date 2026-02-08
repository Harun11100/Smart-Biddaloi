"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentListAttendance({
  schoolId,
  classId,
  className,
  sectionName,
}) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [attendanceTaken, setAttendanceTaken] = useState(false);

  const STORAGE_KEY = `students_${classId}`;

  const today = new Date();
  const formattedDate = today
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-");

  const normalizeStudent = (student) => ({
    _id: student._id,
    name: student.name,
    roll: student.roll,
    status: student.status || "absent",
  });

  const checkTodayAttendance = async () => {
    try {
      const res = await axios.post(
        `/api/school/student/attendance/getToday`,
        { schoolId, classId, date: formattedDate }
      );

      if (res.data.success && res.data.alreadyTaken) {
        setAttendanceTaken(true);
        setStudents(
          res.data.attendance.map((s) => ({
            _id: s.studentId,
            name: s.name,
            roll: s.roll,
            status: s.status,
          }))
        );
      } else {
        await fetchStudentsFromDb();
      }
    } catch {
      await fetchStudentsFromDb();
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsFromDb = async () => {
    const res = await axios.get(
      `/api/school/student/getStudents?schoolId=${schoolId}&classId=${classId}`
    );
    const data = res.data.data.map(normalizeStudent);
    setStudents(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  useEffect(() => {
    if (schoolId && classId) checkTodayAttendance();
  }, [schoolId, classId]);

  const toggleStatus = (id) => {
    const updated = students.map((s) =>
      s._id === id
        ? { ...s, status: s.status === "present" ? "absent" : "present" }
        : s
    );
    setStudents(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      const payload = {
        schoolId,
        classId,
        date: formattedDate,
        attendance: students.map((s) => ({
          studentId: s._id,
          status: s.status,
          ...(attendanceTaken ? {} : { name: s.name, roll: s.roll }),
        })),
      };

      const endpoint = attendanceTaken
        ? `/api/school/student/attendance/update`
        : `/api/school/student/attendance/save`;

      const res = attendanceTaken
        ? await axios.put(endpoint, payload)
        : await axios.post(endpoint, payload);

      if (res.data.success) setAttendanceTaken(true);
    } finally {
      setSaving(false);
    }
  };

  const displayDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Student Attendance
        </h1>
        <p className="text-gray-600">
          Class: {className || "N/A"} | Section: {sectionName || "N/A"}
        </p>
        <p className="text-gray-500 text-sm mt-1">{displayDate}</p>
        <p className="text-gray-600 mt-2">
          Total Students: {students.length}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Roll
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr
                key={s._id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 font-medium text-gray-800">
                  {s.name}
                </td>
                <td className="py-3 px-4 text-gray-600">{s.roll}</td>

                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      s.status === "present"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.status === "present" ? "Present" : "Absent"}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => toggleStatus(s._id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold text-white shadow-md transition ${
                      s.status === "present"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    Mark {s.status === "present" ? "Absent" : "Present"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={saveAttendance}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : attendanceTaken
            ? "Update Attendance"
            : "Save Attendance"}
        </button>
      </div>
    </div>
  );
}
