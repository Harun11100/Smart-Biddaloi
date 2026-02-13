"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import TableSearch from "@/app/components/TableSearch";
import RollFilter from "@/app/components/RollFilter";
import { filterStudentsByRollAndStatus } from "@/app/utils/filterStudents";

export default function FeeCollection({
  studentData = [],
  schoolId,
  classId,
  className,
  sectionName,
  slug
}) {


  const router = useRouter();
  const STORAGE_KEY = `students_${classId}`;

  const [students, setStudents] = useState(studentData);
  const [filtered, setFiltered] = useState(studentData);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(!studentData.length);
  const [rollQuery, setRollQuery] = useState("");

  /* ---------------- Date ---------------- */

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
  const result = filterStudentsByRollAndStatus({
    students,
    rollQuery,
    status: activeFilter,
  });

  setFiltered(result);
}, [students, activeFilter, rollQuery]);

useEffect(() => {
  if (activeFilter === "all") {
    setFiltered(students);
  } else {
    setFiltered(students.filter((s) => s.paymentStatus === activeFilter));
  }
}, [students, activeFilter]);


  useEffect(() => {
    if (studentData.length) {
      setLoading(false);
      return;
    }

    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setStudents(parsed);
        setFiltered(parsed);
      }
    } catch (err) {
      console.error("Failed to load cached students", err);
    } finally {
      setLoading(false);
    }
  }, [STORAGE_KEY, studentData]);

  /* ---------------- Filtering ---------------- */

  useEffect(() => {
    if (activeFilter === "all") {
      setFiltered(students);
    } else {
      setFiltered(students.filter((s) => s.paymentStatus === activeFilter));
    }
  }, [students, activeFilter]);

  /* ---------------- Actions ---------------- */

  const changeStatus = async (item) => {
    if (item.paymentStatus === "paid") {
      alert(
        "Once marked as paid, status can only be changed from payment history."
      );
      return;
    }

    if (!confirm(`Mark ${item.name} as PAID?`)) return;

    try {
      const res = await axios.put(`/api/school/updatePaymentStatus`, {
        studentId: item._id,
        classId,
        status: "paid",
      });

      if (res.data.success) {
        const updated = students.map((s) =>
          s._id === item._id
            ? {
                ...s,
                paymentStatus: "paid",
                totalDueAmount: 0,
                totalPaidAmount: s.totalMonthlyFees,
              }
            : s
        );

        setStudents(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error while updating payment status.");
    }
  };

  const sendReminder = async (item) => {
    try {
      const res = await fetch(`/api/school/send-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: item._id,
          title: "School Fee Reminder",
          body: `${item.name}'s school fees are still unpaid. Please pay soon.`,
        }),
      });

      const data = await res.json();
      alert(data.success ? "Notification sent!" : "Failed to send.");
    } catch {
      alert("Error sending notification.");
    }
  };

  const savePaymentHistory = async (item) => {
    try {
      const res = await fetch(`/api/school/save-payment-history`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: item._id, schoolId }),
      });

      const data = await res.json();
      alert(data.success ? "Payment history saved!" : "Failed to save history.");
    } catch {
      alert("Error saving payment history.");
    }
  };

  /* ---------------- UI ---------------- */

  if (!students.length && !loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No students found
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
     {/* Header */}
  <div className="mb-6 flex flex-col gap-4">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h1 className="text-xl font-bold text-gray-900 tracking-tight">
        Fee Collection
      </h1>
      <p className="mt-0.5 text-sm text-gray-600">
        {className || "N/A"}
        {sectionName && (
          <span className="text-gray-400"> · Section {sectionName}</span>
        )}
      </p>
    </div>

  <div className="flex items-center gap-2">

  </div>

    <div className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
      {formattedDate}
    </div>
  </div>

  <div className="flex w-full gap-2 overflow-x-auto pb-1 mt-1 pt-2">
    {[
      { key: "all", label: "All" },
      { key: "paid", label: "Paid" },
      { key: "unpaid", label: "Unpaid" },
    ].map((f) => (
      <button
        key={f.key}
        onClick={() => setActiveFilter(f.key)}
        className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-semibold transition
          ${
            activeFilter === f.key
              ? "bg-blue-500 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
      >
        {f.label}
      </button>
    ))}
    <div className="flex items-center gap-2">
  <RollFilter
  value={rollQuery}
  onChange={setRollQuery}
  className="w-40"
/>

  
  </div>
  </div>
</div>


      {/* List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3">
  {filtered.map((item) => (
    <div
      key={item._id}
      onClick={() =>
        router.push(
          `/list/${slug}/${schoolId}/payments/studentList/${classId}/payment-history?studentId=${item._id}`
        )
      }
      className="group cursor-pointer rounded-xl border border-gray-100 
                 bg-gradient-to-br from-white to-gray-50 
                 px-4 py-3 shadow-sm transition
                 hover:shadow-md hover:border-blue-100"
    >
      {/* ROW 1 */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {item.name}
          </p>
          <p className="text-xs text-gray-500">
            Roll {item.roll}
          </p>
        </div>

        <div
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            item.paymentStatus === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              item.paymentStatus === "paid"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          />
          {item.paymentStatus === "paid" ? "PAID" : "DUE"}
        </div>
      </div>

      {/* ROW 2 */}
      <div className="mt-2 flex items-center justify-between gap-3">
        <p
          className={`text-sm font-bold ${
            item.paymentStatus === "paid"
              ? "text-green-700"
              : "text-red-600"
          }`}
        >
          ৳{" "}
          {item.paymentStatus === "paid"
            ? item.totalPaidAmount
            : item.totalDueAmount}
        </p>

        <div className="flex items-center gap-1.5">
          {item.paymentStatus === "unpaid" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sendReminder(item);
                }}
                className="rounded-md bg-sky-500/90 px-2.5 py-1 
                           text-xs font-medium text-white
                           hover:bg-sky-600"
              >
                Remind
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  savePaymentHistory(item);
                }}
                className="rounded-md bg-gray-900/90 px-2.5 py-1 
                           text-xs font-medium text-white
                           hover:bg-gray-900"
              >
                Save
              </button>
            </>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              changeStatus(item);
            }}
            className="rounded-md bg-blue-500/90 px-2.5 py-1 
                       text-xs font-medium text-white
                       hover:bg-blue-600"
          >
            Mark Paid
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

      )}
    </div>
  );
}
