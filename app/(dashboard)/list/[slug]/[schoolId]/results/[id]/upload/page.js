"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function StudentResultView() {
  const router = useRouter();
  const params = useParams(); 
  const { schoolId, studentId, id } = params ?? {}; 

  const [examType, setExamType] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [deleteLoadingIds, setDeleteLoadingIds] = useState([]);

  const fetchStudentResults = async (type) => {
    if (!type || !schoolId || !studentId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/school/student/result/getResult`, {
        params: { schoolId, studentId, examType: type },
      });
      setResults(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      alert("Unable to load results.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!examType) return alert("Please select an exam type!");
    fetchStudentResults(examType);
  };

  const deleteResult = async (resultId) => {
    if (!resultId) return;
    setDeleteLoadingIds((prev) => [...prev, resultId]);
    try {
      const res = await axios.delete(`/api/school/student/result/deleteResult`, {
        data: { studentId, resultId, schoolId },
      });
      if (res.data?.success) {
        setResults((prev) => prev.filter((r) => r._id !== resultId));
        alert("Result deleted successfully.");
      } else alert("Failed to delete the result.");
    } catch (err) {
      console.error(err);
      alert("There was a problem deleting the result.");
    } finally {
      setDeleteLoadingIds((prev) => prev.filter((id) => id !== resultId));
    }
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
      
        {/* Exam Type Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Exam Type</option>
            <option value="১ম সাময়িক">First Term</option>
            <option value="২য় সাময়িক">Second Term</option>
            <option value="৩য় সাময়িক">Third Term</option>
            <option value="টিউটোরিয়াল">Tutorial Exam</option>
            <option value="বার্ষিক পরীক্ষা">Annual Exam</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 ? (
          results.map((result) => {
            const resultArray = Array.isArray(result.results) ? result.results : [];
            const hasFail = resultArray.some((r) => r.grade === "F" || r.mark < r.passingMarks);
            const displayGpa = hasFail ? "F" : result.gpa;

            return (
              <div key={result._id} className="bg-white shadow-lg rounded-xl p-6 space-y-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-blue-700">{result.examType}</h2>
                  <button
                    onClick={() => deleteResult(result._id)}
                    disabled={deleteLoadingIds.includes(result._id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    {deleteLoadingIds.includes(result._id) ? "..." : "Delete"}
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="p-3 text-left">Subject</th>
                        <th className="p-3 text-left">Marks</th>
                        <th className="p-3 text-left">Max</th>
                        <th className="p-3 text-left">Pass</th>
                        <th className="p-3 text-left">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultArray.map((item, idx) => {
                        const isFailed = item.grade === "F" || item.mark < item.passingMarks;
                        return (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                            <td className="p-2">{item.subject}</td>
                            <td className="p-2">{item.mark}</td>
                            <td className="p-2">{item.maxMarks}</td>
                            <td className="p-2">{item.passingMarks}</td>
                            <td className={`p-2 font-semibold ${isFailed ? "text-red-600" : "text-green-700"}`}>
                              {item.grade}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="flex justify-between mt-2 bg-blue-50 p-3 rounded-lg">
                  <div>
                    <p className="font-semibold">GPA: {displayGpa}</p>
                    {displayGpa !== "F" && <p>Final Grade: {result.finalGrade}</p>}
                  </div>
                  <div>
                    <p className="font-semibold">Total Marks: {result.totalMarks}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          !loading && (
            <div className="text-center text-gray-400 py-10">
              <p>No results found.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}