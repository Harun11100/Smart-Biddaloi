"use client";
import { useState } from "react";
import axios from "axios";

export default function DisableAlertButton({ schoolId }) {
  const [loading, setLoading] = useState(false);

  const handleDisable = async () => {
    try {
      setLoading(true);

      const res = await axios.put("/api/school/availableAlert", {
        schoolId,
        availableAlert: false,
      });

      alert("Alert disabled successfully");
      window.location.reload(); // refresh to show updated status
    } catch (err) {
      console.error(err);
      alert("Failed to disable alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDisable}
      disabled={loading}
      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
    >
      {loading ? "Disabling..." : "Disable Alert"}
    </button>
  );
}