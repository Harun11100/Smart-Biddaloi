


"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

import Announcements from "@/app/components/Announcements";
import AttendanceChart from "@/app/components/AttendanceChart";
import CountChart from "@/app/components/CountChart";
import EventCalendar from "@/app/components/EventCalendar";
import FinanceChart from "@/app/components/FinanceChart";
import UserCard from "@/app/components/UserCard";
import AdminDashboardLayout from "@/app/components/admin/layout/AdminDashboardLayout";

type SchoolData = {
  _id: string;
  totalStudents: number;
  totalPaymentCount: number;
  totalTeachers: number;
  totalNotice: number;
  
};

type StatItem = {
  id: number;
  title: string;
  count: number;
  isButton?: boolean;
};

// =================================

export default function AdminPage() {
  const params = useParams() as { slug: string };
  const slug = params.slug;

  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [otpModal, setOtpModal] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);

  const fetchSchoolData = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const res = await axios.get(`/api/school/getSchoolDetails?slug=${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setSchoolData(res.data.school);
        localStorage.setItem("schoolData", JSON.stringify(res.data.school));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("schoolData");
    if (stored) setSchoolData(JSON.parse(stored));
    fetchSchoolData();
  }, [slug]);

  const resetPaymentCount = async () => {
    if (!confirm("Are you sure you want to reset monthly payment count?")) return;

    try {
      const res = await axios.post(`/api/school/resetPaymentCount`, {
        slug,
      });

      if (res.data.success) {
        setOtpModal(true);
      } else {
        alert("Failed to send verification code.");
      }
    } catch {
      alert("Server error!");
    }
  };

  const verifyOtpAndReset = async () => {
    if (!otp.trim()) return alert("Enter verification code");

    setVerifying(true);
    try {
      const res = await axios.post(`/api/school/verifyResetCode`, {
        slug,
        code: otp,
      });

      if (res.data.success) {
        alert("Payment count reset successfully.");
        setOtpModal(false);
        fetchSchoolData();
      } else {
        alert("Wrong code.");
      }
    } catch {
      alert("Verification failed.");
    }

    setVerifying(false);
  };

if (loading)
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      {/* Modern Spinner */}
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
  );

  if (!schoolData)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-red-600 text-xl">No data found</p>
        <p className="text-gray-600">Check connection and try again</p>
      </div>
    );

  const stats: StatItem[] = [
    { id: 1, title: "Students", count: schoolData.totalStudents },
    {
      id: 2,
      title: "Payment Count",
      count: schoolData.totalPaymentCount,
      isButton: true,
    },
    { id: 3, title: "Teachers", count: schoolData.totalTeachers },
    { id: 4, title: "Notice", count: schoolData.totalNotice },
  ];

  return (
    <AdminDashboardLayout slug={slug}>
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50">
      {/* OTP Modal */}
      {otpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-[350px] max-w-[90%] text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">OTP Verification</h2>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg"
            />

            <button
              onClick={verifyOtpAndReset}
              disabled={verifying}
              className={`w-full mt-5 py-3 rounded-lg text-white font-semibold ${
                verifying ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {verifying ? "Verifying..." : "Verify"}
            </button>

            <button
              onClick={() => setOtpModal(false)}
              className="mt-3 text-gray-500 hover:text-gray-700 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((item) => (
          <div
            key={item.id}
            onClick={item.isButton ? () => resetPaymentCount() : undefined}
            className={item.isButton ? "cursor-pointer" : "cursor-default"}
          >
            <UserCard count={item.count} title={item.title} />
          </div>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-8">

        {/* LEFT SECTION */}
        <div className="w-full xl:w-2/3 flex flex-col gap-8">

          {/* COUNT + ATTENDANCE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 h-[420px] bg-white shadow rounded-xl p-4">
              <CountChart  />
            </div>

            <div className="col-span-1 lg:col-span-2 h-[420px] bg-white shadow rounded-xl p-4">
              <AttendanceChart/>
            </div>
          </div>

          {/* FINANCE CHART */}
          <div className="h-[480px] bg-white shadow rounded-xl p-4">
            <FinanceChart />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full xl:w-1/3 flex flex-col gap-8">
          <div className="bg-white shadow rounded-xl p-4">
            <EventCalendar />
          </div>

          {/* <div className="bg-white shadow rounded-xl p-4">
            <Announcements/>
          </div> */}
        </div>
      </div>

    </div>
     </AdminDashboardLayout>
  );
}


    
  
