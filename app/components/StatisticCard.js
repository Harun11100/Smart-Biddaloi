// app/admin-dashboard/components/StatisticCard.js
"use client";

import React from "react";

const StatisticCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
      <div className="text-indigo-600 text-3xl">{icon}</div>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default StatisticCard;
