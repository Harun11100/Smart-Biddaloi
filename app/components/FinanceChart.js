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

/**
 * financeData expected format:
 * [
 *   { date: "ফেব্রুয়ারী ২০২৬", totalMonthlyCollection: 800, totalMonthlyDue: 800 },
 *   ...
 * ]
 */

const FinanceChart = ({ totalMonthlyPaymentCollection = [] }) => {
  // map API data to Recharts format
  const chartData = totalMonthlyPaymentCollection.map((item) => ({
    name: item.date, // month name (Bengali)
    received: item.totalMonthlyCollection || 0,
    due: item.totalMonthlyDue || 0,
  }));

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl w-full h-full p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
          Monthly Payment Summary
        </h1>
        <Image
          src="/moreDark.png"
          alt="menu"
          width={20}
          height={20}
          className="opacity-70 hover:opacity-100 transition"
        />
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={chartData}
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

          {/* Received Line */}
          <Line
            type="monotone"
            dataKey="received"
            name="Received Payment"
            stroke="#10B981"
            strokeWidth={4}
            dot={{ r: 4, strokeWidth: 2, fill: "white", stroke: "#10B981" }}
            activeDot={{ r: 6 }}
          />

          {/* Due Line */}
          <Line
            type="monotone"
            dataKey="due"
            name="Due Payment"
            stroke="#EF4444"
            strokeWidth={4}
            dot={{ r: 4, strokeWidth: 2, fill: "white", stroke: "#EF4444" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
