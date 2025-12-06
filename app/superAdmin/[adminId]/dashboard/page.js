"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import StatisticCard from "@/app/components/StatisticCard";
import axios from "axios";

export default function AdminDashboard() {
  const router = useRouter();
  const params = useParams();
  const adminId = params.adminId;

  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          router.push("/admin/login");
          return;
        }

        const res = await axios.get("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            adminId, // 🔥 also send adminId
          },
        });

        if (res.data.success === false) {
          router.push("/admin/login");
          return;
        }

        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        router.push("/admin/login");
      }
    };

    fetchStats();
  }, [adminId]);

  return (
    <div className="flex min-h-screen">
      <Sidebar adminId={adminId} />

      <div className="flex-1 p-8 bg-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatisticCard title="Total Schools" value={stats.totalSchools} icon="🏫" />
          <StatisticCard title="Total Students" value={stats.totalStudents} icon="👨‍🎓" />
          <StatisticCard title="Total Teachers" value={stats.totalTeachers} icon="👩‍🏫" />
        </div>
      </div>
    </div>
  );
}
