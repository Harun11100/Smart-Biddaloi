"use client";

import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

const CountChart = ({
  totalMaleStudents = 0,
  totalFemaleStudents = 0,
}) => {
  const total = totalMaleStudents + totalFemaleStudents;

  const malePercent = total
    ? Math.round((totalMaleStudents / total) * 100)
    : 0;

  const femalePercent = total
    ? Math.round((totalFemaleStudents / total) * 100)
    : 0;

  const data = [
    {
      name: "Total",
      count: total,
      fill: "#ffffff",
    },
    {
      name: "Girls",
      count: totalFemaleStudents,
      fill: "#FAE27C",
    },
    {
      name: "Boys",
      count: totalMaleStudents,
      fill: "#C3EBFA",
    },
  ];

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar
              background
              dataKey="count"
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <Image
          src="/maleFemale.png"
          alt="Students"
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* BOTTOM STATS */}
      <div className="flex justify-center gap-16">
        {/* BOYS */}
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">
            {totalMaleStudents}
          </h1>
          <h2 className="text-xs text-gray-300">
            Boys ({malePercent}%)
          </h2>
        </div>

        {/* GIRLS */}
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">
            {totalFemaleStudents}
          </h1>
          <h2 className="text-xs text-gray-300">
            Girls ({femalePercent}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
