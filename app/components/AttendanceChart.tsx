"use client";
import Image from "next/image";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", present: 60, absent: 40 },
  { name: "Tue", present: 70, absent: 60 },
  { name: "Wed", present: 90, absent: 75 },
  { name: "Thu", present: 90, absent: 75 },
  { name: "Fri", present: 65, absent: 55 },
];

const AttendanceChart = () => {
  return (
    <div className="rounded-2xl p-5 h-full bg-gradient-to-br from-white to-blue-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
          Attendance Overview
        </h1>
        <button className="p-1 hover:bg-gray-100 rounded-full transition">
          <Image src="/moreDark.png" alt="more" width={20} height={20} />
        </button>
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} barSize={22}>

          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />

          {/* X-Axis */}
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={false}
          />

          {/* Y-Axis */}
          <YAxis
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={false}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              borderColor: "lightgray",
              padding: "8px 12px",
            }}
          />

          {/* Legend */}
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "20px" }}
          />

          {/* Present Bar (Green Gradient) */}
          <Bar
            dataKey="present"
            fill="url(#presentGradient)"
            radius={[10, 10, 0, 0]}
            legendType="circle"
          />

          {/* Absent Bar (Red Gradient) */}
          <Bar
            dataKey="absent"
            fill="url(#absentGradient)"
            radius={[10, 10, 0, 0]}
            legendType="circle"
          />

          {/* Gradient Definitions */}
          <defs>
            {/* Present Gradient */}
            <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#86efac" />
            </linearGradient>

            {/* Absent Gradient */}
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
