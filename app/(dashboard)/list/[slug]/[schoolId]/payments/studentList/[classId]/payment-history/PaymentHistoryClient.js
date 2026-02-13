"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentHistoryClient({schoolId,classId,studentId}) {

  const [student, setStudent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔹 English date formatter */
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  };

  /* 🔹 Fetch student + payment history */
  useEffect(() => {
    if (!schoolId || !classId || !studentId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/school/student/getStudent`, {
          params: { schoolId, classId, studentId },
        });

        setStudent(res.data?.data?.student);
        setHistory(res.data?.data?.paymentHistory || []);
      } catch (err) {
        alert("Failed to load student information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId, classId, studentId]);

  /* 🔄 Change payment status */
  const changeHistoryStatus = async (paymentId) => {
    if (!confirm("Do you want to change this month's payment status?")) return;

    try {
      const res = await axios.put(`/api/school/updateHistory`, {
        studentId,
        classId,
        paymentId,
      });

      if (res.data.success) {
        alert("Payment status updated successfully");
        setStudent(res.data.updatedStudent);
      } else {
        alert("Failed to update payment status");
      }
    } catch {
      alert("An error occurred while updating the status");
    }
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="mt-10 text-center text-red-500">
        No student information found
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      {/* Header */}
      <div className="rounded-xl bg-white p-4 shadow">
        <h1 className="text-center text-lg font-bold text-gray-900">
          {student.studentName}
        </h1>
        <p className="mt-1 text-center text-sm text-gray-600">
          Class: {student.className} | Roll: {student.roll}
        </p>
      </div>

      {/* Payment History */}
  {/* Payment History */}
<div className="rounded-2xl bg-white p-5 shadow-sm">
  <h2 className="mb-4 text-center text-sm font-semibold tracking-wide text-gray-800">
    Fee & Payment History
  </h2>

  {/* Table header */}
  <div className="mb-2 hidden grid-cols-3 rounded-lg bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 sm:grid">
    <span>Date</span>
    <span className="text-center">Amount</span>
    <span className="text-right">Status</span>
  </div>

  {/* Rows */}
  {history.length ? (
    <div className="space-y-2">
      {history.map((item) => (
        <div
          key={item._id}
          onClick={() => changeHistoryStatus(item._id)}
          className="group grid cursor-pointer grid-cols-1 gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm transition hover:border-blue-200 hover:bg-blue-50/40 sm:grid-cols-3 sm:items-center"
        >
          {/* Date */}
          <div className="text-gray-700">
            <p className="font-medium">{formatDate(item.paymentDate)}</p>
            <p className="text-xs text-gray-400 sm:hidden">Payment date</p>
          </div>

          {/* Amount */}
          <div className="text-gray-900 sm:text-center">
            <span className="font-semibold">৳{item.totalAmount}</span>
          </div>

          {/* Status */}
          <div className="flex sm:justify-end">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                item.paymentStatus === "paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.paymentStatus === "paid" ? "Paid" : "Unpaid"}
            </span>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="py-6 text-center text-sm text-gray-500">
      No payment history available
    </p>
  )}

  {/* Summary */}
  <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4 text-sm font-semibold">
    <div className="text-center text-green-700">
      <p className="text-xs text-gray-500">Total Paid</p>
      ৳{student.totalPaidAmount}
    </div>
    <div className="text-center text-red-600">
      <p className="text-xs text-gray-500">Total Due</p>
      ৳{student.totalDueAmount}
    </div>
  </div>
</div>


      {/* Guardian & Fee Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Guardian Information">
          <Info label="Name" value={student.guardianName} />
          <Info label="Phone" value={student.guardianPhone} />
        </InfoCard>

        <InfoCard title="Fee Information">
          <Info label="Tuition Fee" value={`৳${student.tuitionFee}`} />
          <Info label="Coaching Fee" value={`৳${student.coachingFee}`} />
        </InfoCard>
      </div>
    </div>
  );
}

/* 🔹 Reusable components */

function InfoCard({ title, children }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h3 className="mb-2 text-center text-sm font-semibold text-gray-800">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
