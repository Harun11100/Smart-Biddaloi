"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", income: 4000, expense: 2400 },
  { name: "Feb", income: 3000, expense: 1398 },
  { name: "Mar", income: 2000, expense: 9800 },
  { name: "Apr", income: 2780, expense: 3908 },
  { name: "May", income: 1890, expense: 4800 },
  { name: "Jun", income: 2390, expense: 3800 },
  { name: "Jul", income: 3490, expense: 4300 },
  { name: "Aug", income: 3490, expense: 4300 },
  { name: "Sep", income: 3490, expense: 4300 },
  { name: "Oct", income: 3490, expense: 4300 },
  { name: "Nov", income: 3490, expense: 4300 },
  { name: "Dec", income: 3490, expense: 4300 },
];

const FinanceChart = () => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl w-full h-full p-6 shadow-sm">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
          Finance Overview
        </h1>
        <Image src="/moreDark.png" alt="menu" width={20} height={20} className="opacity-70 hover:opacity-100 transition" />
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />

          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            tickLine={false}
            tickMargin={12}
          />

          <YAxis
            axisLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            tickLine={false}
            tickMargin={12}
          />

          <Tooltip
            contentStyle={{
              borderRadius: 12,
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />

          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: 20, marginTop: 10 }}
          />

          {/* Smooth, rounded lines */}
          <Line
            type="monotone"
            dataKey="income"
            stroke="#4F9CF9"
            strokeWidth={4}
            dot={{ r: 4, strokeWidth: 2, fill: "white", stroke: "#4F9CF9" }}
            activeDot={{ r: 6 }}
          />

          <Line
            type="monotone"
            dataKey="expense"
            stroke="#F973A5"
            strokeWidth={4}
            dot={{ r: 4, strokeWidth: 2, fill: "white", stroke: "#F973A5" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
