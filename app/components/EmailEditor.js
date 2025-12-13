"use client";
import { useState } from "react";

export default function EmailEditor({ schoolId, email }) {
  const [value, setValue] = useState(email);
  const [loading, setLoading] = useState(false);

  const updateEmail = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/school/updateEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId, email: value }),
      });

      const data = await res.json();
      alert(data.message || "Updated");
    } catch {
      alert("ইমেইল আপডেট করার সময় একটি ত্রুটি ঘটেছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        ইমেইল
      </label>

      <input
        type="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-3 py-2 border rounded bg-white"
      />

      <button
        onClick={updateEmail}
        disabled={loading}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Updating..." : "ইমেইল update করুন"}
      </button>
    </div>
  );
}
