"use client";
import { useState } from "react";
import axios from "axios";

export default function CreateAlert({ schoolId, alertTitle, alertMessage, availableAlert }) {


  const [newAlertTitle, setNewAlertTitle] = useState(alertTitle || "");
  const [newAlertMessage, setNewAlertMessage] = useState(alertMessage || "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(availableAlert); // track current alert status

  const handleEnable = async () => {
    if (!newAlertTitle.trim() || !newAlertMessage.trim()) {
      alert("Please fill out both fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put("/api/school/updateAlert", {
        schoolId,
        availableAlert:true,
        alertTitle: newAlertTitle,
        alertMessage: newAlertMessage,
      });
      alert(res.data.message || "Alert enabled successfully!");
      setStatus(true); // update local status
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to enable alert");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    try {
      setLoading(true);
      await axios.put("/api/school/availableAlert", {
        schoolId,
        availableAlert: false,
      });
      alert("Alert disabled successfully!");
      setStatus(false); // update local status
    } catch (err) {
      console.error(err);
      alert("Failed to disable alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-blue-900 text-center">
        🔔 Emergency Alert
      </h2>

      {/* Input Fields */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-gray-700 font-medium">Alert Title</label>
          <input
            type="text"
            value={newAlertTitle}
            onChange={(e) => setNewAlertTitle(e.target.value)}
            placeholder="Enter alert title"
            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="text-gray-700 font-medium">Alert Message</label>
          <textarea
            value={newAlertMessage}
            onChange={(e) => setNewAlertMessage(e.target.value)}
            placeholder="Enter alert message"
            rows={3}
            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
          ></textarea>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4">
        {status ? (
          <button
            onClick={handleDisable}
            disabled={loading}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl shadow-md hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Disable Alert"}
          </button>
        ) : (
          <button
            onClick={handleEnable}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Enable & Save Alert"}
          </button>
        )}
      </div>
    </div>
  );
}