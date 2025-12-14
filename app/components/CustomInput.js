'use client';

import React from "react";

const CustomInput = ({ label, error, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full md:w-1/4">
      <label className="text-xs text-gray-500">{label}</label>

      <input
        {...props}
        className={`w-full p-2 text-sm rounded-md border border-gray-300 
          focus:outline-none focus:ring-2 focus:ring-blue-400
          ${className ?? ""}`}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CustomInput;
