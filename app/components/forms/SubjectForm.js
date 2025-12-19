'use client';

import { useState, useEffect } from "react";
import axios from "axios";

export default function SubjectForm({ type, data, schoolId, onSuccess }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [creditHours, setCreditHours] = useState(0);
  const [maxMarks, setMaxMarks] = useState(100);
  const [passingMarks, setPassingMarks] = useState(33);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type === "update" && data) {
      setName(data.name || "");
      setCode(data.code || "");
      setCreditHours(data.creditHours ?? 0);
      setMaxMarks(data.maxMarks ?? 100);
      setPassingMarks(data.passingMarks ?? 33);
    }
  }, [type, data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !code) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      let response;
      if (type === "create") {
        response = await axios.post("/api/school/subject/createSubject", {
          schoolId,
          name,
          code,
          creditHours,
          maxMarks,
          passingMarks,
        });
      } else if (type === "update") {
        response = await axios.put("/api/school/subject/updateSubject", {
          subjectId: data._id,
          name,
          code,
          creditHours,
          maxMarks,
          passingMarks,
        });
      }

      const resData = response.data;

      if (resData.success) {
        alert(type === "create" ? "Subject created!" : "Subject updated!");
        onSuccess?.(resData.data);
      } else {
        alert(resData.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save subject.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto  rounded-xl space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800">
        {type === "create" ? "Add Subject" : "Update Subject"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Subject Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Credit Hours</label>
          <input
            type="number"
            value={creditHours}
            onChange={(e) => setCreditHours(Number(e.target.value))}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Max Marks</label>
          <input
            type="number"
            value={maxMarks}
            onChange={(e) => setMaxMarks(Number(e.target.value))}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Passing Marks</label>
          <input
            type="number"
            value={passingMarks}
            onChange={(e) => setPassingMarks(Number(e.target.value))}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
      >
        {loading ? "Saving..." : type === "create" ? "Create Subject" : "Update Subject"}
      </button>
    </form>
  );
}
