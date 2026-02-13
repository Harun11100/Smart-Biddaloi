"use client";

import { X, Search } from "lucide-react";

export default function RollFilter({
  value,
  onChange,
  placeholder = "Search by roll",
  className = "",
}) {
  return (
    <div
      className={`relative flex items-center gap-2 rounded-xl 
                  border border-gray-200 bg-white px-3 py-2
                  shadow-sm transition
                  focus-within:border-blue-500 
                  focus-within:ring-2 focus-within:ring-blue-500/20
                  ${className}`}
    >
      {/* Icon */}
      <Search className="h-4 w-4 text-gray-400" />

      {/* Input */}
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-20 bg-transparent text-sm text-gray-900
                   placeholder:text-gray-400
                   outline-none"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="rounded-full p-1 text-gray-400 
                     transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Clear roll filter"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
