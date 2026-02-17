"use client";

import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// helper: date -> weekday (Mon, Tue, etc.)
const getDayName = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const AttendanceChart = ({ weeklyAttendanceChartData = [] }) => {
  // 🔁 transform API data to chart format
  const chartData = weeklyAttendanceChartData.map((item) => ({
    name: getDayName(item.date),
    present: item.totalPresent,
    absent: item.totalAbsent,
  }));

  return (
    <div className="rounded-2xl p-5 h-full bg-gradient-to-br from-white to-blue-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Attendance Overview
        </h1>
        <button className="p-1 hover:bg-gray-100 rounded-full transition">
          <Image src="/moreDark.png" alt="more" width={20} height={20} />
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barSize={22}>
          
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              borderColor: "lightgray",
              padding: "8px 12px",
            }}
          />

          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: "20px" }}
          />

          {/* Present */}
          <Bar
            dataKey="present"
            fill="url(#presentGradient)"
            radius={[10, 10, 0, 0]}
            legendType="circle"
          />

          {/* Absent */}
          <Bar
            dataKey="absent"
            fill="url(#absentGradient)"
            radius={[10, 10, 0, 0]}
            legendType="circle"
          />

          <defs>
            <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#86efac" />
            </linearGradient>

            <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#fecaca" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
