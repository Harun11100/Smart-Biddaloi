"use client";
import { useState } from "react";
import axios from "axios";

export default function AppUrlUpdater({ schoolId, existingUrl,versionCode }) {
  const [newUrl, setNewUrl] = useState(existingUrl);
  const [vCode,setvCode]=useState(versionCode)
  const [loading, setLoading] = useState(false);

  const handleUpdateUrl = async () => {

    try {
      setLoading(true);
      const res = await axios.put("/api/school/updateAppUrl", {
        schoolId,
        appUpdateUrl:newUrl||"",
        versionCode:vCode||"",
      });
      alert(res.data.message || "App URL updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update App URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-4">
      <input
        type="text"
        value={newUrl}
        onChange={(e) => setNewUrl(e.target.value)}
        placeholder="Enter new app download URL"
        className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
       <input
        type="text"
        value={vCode}
        onChange={(e) => setvCode(e.target.value)}
        placeholder="Enter new app version code"
        className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <button
        onClick={handleUpdateUrl}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update URL"}
      </button>
    </div>
  );
}