"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Trophy,
  Printer,
  Download,
  Search,
  CheckCircle2,
  XCircle,
  Users,
  Award,
  AlertCircle,
  FileSpreadsheet,
  ArrowUpDown,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ClassResultSheetClient() {
  // Query parameters
  const searchParams = useSearchParams();

  const classId = searchParams.get("classId");
  const className = searchParams.get("className");
  const sectionName = searchParams.get("sectionName");
  const schoolId = searchParams.get("schoolId");

  console.log("ClassResultSheetClient Props:", {
    classId,
    className,
    sectionName,
    schoolId,
  });

  // Semesters State
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [semestersLoading, setSemestersLoading] = useState(false);

  // API response state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PASSED, FAILED
  const [sortBy, setSortBy] = useState("POSITION"); // POSITION, ROLL

  // =========================================================
  // 1. FETCH ALL SEMESTERS FOR SCHOOL
  // =========================================================
  useEffect(() => {
    const fetchSemesters = async () => {
      if (!schoolId) return;

      setSemestersLoading(true);
      try {
        const res = await axios.get("/api/school/semester/getSemesters", {
          params: { schoolId },
        });

        const fetchedData = Array.isArray(res.data?.data) ? res.data.data : [];
        setSemesters(fetchedData);

        // Auto-select the first semester if none is selected yet
        if (!selectedSemester && fetchedData.length > 0) {
          setSelectedSemester(fetchedData[0]._id);
        }
      } catch (err) {
        console.error("Error fetching semesters:", err);
      } finally {
        setSemestersLoading(false);
      }
    };

    fetchSemesters();
  }, [schoolId]);

  // =========================================================
  // 2. FETCH RESULT SHEET DATA FOR SELECTED SEMESTER
  // =========================================================
  const fetchResultSheet = async (semId) => {
    if (!schoolId || !classId || !semId) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        "/api/school/results/semister/class-result-sheet",
        {
          params: {
            schoolId,
            classId,
            semesterId: semId,
          },
        }
      );

      if (response.data?.success) {
        setData(response.data);
      } else {
        setError(
          response.data?.message || "ফলাফল তথ্য লোড করতে ব্যর্থ হয়েছে।"
        );
      }
    } catch (err) {
      console.error("Error fetching class result sheet:", err);
      setError(
        err.response?.data?.message ||
          "সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSemester) {
      fetchResultSheet(selectedSemester);
    }
  }, [selectedSemester, schoolId, classId]);

  // Handle Semester Tab Change
  const handleSemesterChange = (semId) => {
    setSelectedSemester(semId);
  };

  // =========================================================
  // FILTERING & SORTING LOGIC
  // =========================================================
  const processedStudents = useMemo(() => {
    if (!data?.students) return [];

    let list = [...data.students];

    // Filter search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (std) =>
          std.name?.toLowerCase().includes(q) ||
          std.roll?.toString().includes(q)
      );
    }

    // Filter status
    if (statusFilter === "PASSED") {
      list = list.filter((std) => std.grade !== "F");
    } else if (statusFilter === "FAILED") {
      list = list.filter((std) => std.grade === "F");
    }

    // Sort order
    if (sortBy === "ROLL") {
      list.sort((a, b) => Number(a.roll || 999999) - Number(b.roll || 999999));
    } else {
      list.sort((a, b) => (Number(a.position) || 999999) - (Number(b.position) || 999999));
    }

    return list;
  }, [data?.students, searchQuery, statusFilter, sortBy]);

  // Statistics summaries
  const stats = useMemo(() => {
    if (!data?.students || data.students.length === 0) {
      return { total: 0, passed: 0, failed: 0, passRate: "0.0", avgGpa: "0.00" };
    }

    const total = data.students.length;
    const passed = data.students.filter((s) => s.grade !== "F").length;
    const failed = total - passed;
    const passRate = ((passed / total) * 100).toFixed(1);

    const gpaSum = data.students.reduce(
      (acc, curr) => acc + (Number(curr.gpa) || 0),
      0
    );
    const avgGpa = (gpaSum / total).toFixed(2);

    return { total, passed, failed, passRate, avgGpa };
  }, [data?.students]);

  // =========================================================
  // EXPORT TO CSV
  // =========================================================
  const handleExportCSV = () => {
    if (!data?.students?.length || !data?.subjects) return;

    const subjects = data.subjects;
    let csvContent = "\uFEFF"; // UTF-8 BOM for Bangla font support

    // CSV Header
    const headers = [
      "মেধা স্থান (Rank)",
      "রোল (Roll)",
      "শিক্ষার্থীর নাম (Name)",
      ...subjects.map((s) => `"${s.name} (${s.maxMarks || 100})"`),
      "মোট নম্বর (Total)",
      "GPA",
      "গ্রেড (Grade)",
      "স্ট্যাটাস (Status)",
    ];
    csvContent += headers.join(",") + "\n";

    // CSV Rows
    data.students.forEach((std) => {
      const subjectScores = subjects.map((sub) => {
        const subData = std.subjects?.[sub.id];
        return subData
          ? `"${subData.mark} (${subData.grade || "-"})"`
          : '"-"';
      });

      const row = [
        std.position || "-",
        std.roll || "-",
        `"${std.name || "Unknown"}"`,
        ...subjectScores,
        std.totalMarks || 0,
        std.gpa || "0.00",
        std.grade || "F",
        std.grade === "F" ? "অনুত্তীর্ণ (Failed)" : "উত্তীর্ণ (Passed)",
      ];

      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Result_Sheet_${data.classInfo?.className || className || "Class"}_${
        data.semesterInfo?.name || "Semester"
      }.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 font-sans text-slate-800 sm:p-6 lg:p-8">
      {/* Dynamic CSS Rules for Native Printing */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-area {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          table {
            font-size: 9pt !important;
            width: 100% !important;
          }
          th,
          td {
            border: 1px solid #cbd5e1 !important;
            padding: 4px 6px !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Banner */}
        <div className="no-print relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 p-6 text-white shadow-xl sm:p-8">
          <div className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 border border-white/20 shadow-inner backdrop-blur-md">
                <Trophy className="h-7 w-7 text-amber-300" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  শ্রেণীভিত্তিক মেধা তালিকা ও ফলাফল
                </h1>
                <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                  শ্রেণী:{" "}
                  <span className="font-extrabold text-white">
                    {data?.classInfo?.className || className || "---"}
                  </span>{" "}
                  {(data?.classInfo?.sectionName || sectionName) && (
                    <>
                      | শাখা:{" "}
                      <span className="font-semibold text-white">
                        {data?.classInfo?.sectionName || sectionName}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Print & CSV Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePrint}
                disabled={loading || !data?.students?.length}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 border border-white/20 backdrop-blur-sm disabled:opacity-50 sm:text-sm"
              >
                <Printer size={16} />
                প্রিন্ট করুন
              </button>
              <button
                onClick={handleExportCSV}
                disabled={loading || !data?.students?.length}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-600 shadow-lg shadow-emerald-900/20 disabled:opacity-50 sm:text-sm"
              >
                <Download size={16} />
                CSV ডাউনলোড
              </button>
            </div>
          </div>
        </div>

        {/* Semester Selection Tabs */}
        <div className="no-print rounded-2xl bg-white p-2 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto p-1 scrollbar-none">
            <div className="flex items-center gap-2 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <BookOpen size={14} />
              সেমিস্টার:
            </div>
            {semestersLoading ? (
              <span className="text-xs text-slate-400 font-medium px-2 flex items-center gap-1">
                <RefreshCw size={12} className="animate-spin text-blue-600" />{" "}
                লোড হচ্ছে...
              </span>
            ) : semesters.length > 0 ? (
              semesters.map((sem) => {
                const isActive = sem._id === selectedSemester;
                return (
                  <button
                    key={sem._id}
                    onClick={() => handleSemesterChange(sem._id)}
                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                    }`}
                  >
                    {sem.name || sem.semesterName || "সেমিস্টার"}
                  </button>
                );
              })
            ) : (
              <span className="text-xs text-slate-400 font-medium px-2">
                কোনো সেমিস্টার পাওয়া যায়নি
              </span>
            )}
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="no-print grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Users className="h-4 w-4 text-blue-600" />
              মোট পরীক্ষার্থী
            </div>
            <p className="mt-2 text-2xl font-black text-slate-800">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              উত্তীর্ণ (Pass)
            </div>
            <p className="mt-2 text-2xl font-black text-emerald-700">
              {stats.passed}{" "}
              <span className="text-xs font-medium text-emerald-600">
                ({stats.passRate}%)
              </span>
            </p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
              <XCircle className="h-4 w-4 text-rose-600" />
              অনুত্তীর্ণ (Fail)
            </div>
            <p className="mt-2 text-2xl font-black text-rose-700">
              {stats.failed}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50/30 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600">
              <Award className="h-4 w-4 text-purple-600" />
              গড় GPA
            </div>
            <p className="mt-2 text-2xl font-black text-purple-700">
              {stats.avgGpa}
            </p>
          </div>
        </div>

        {/* Controls Toolbar (Search, Filter, Sort) */}
        <div className="no-print flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="শিক্ষার্থীর নাম বা রোল খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="ALL">সকল স্ট্যাটাস</option>
              <option value="PASSED">শুধুমাত্র উত্তীর্ণ</option>
              <option value="FAILED">শুধুমাত্র অনুত্তীর্ণ</option>
            </select>

            {/* Sort Toggle */}
            <button
              onClick={() =>
                setSortBy((prev) =>
                  prev === "POSITION" ? "ROLL" : "POSITION"
                )
              }
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              <ArrowUpDown size={14} className="text-blue-600" />
              সাজান:{" "}
              {sortBy === "POSITION"
                ? "মেধা ক্রমানুসারে"
                : "রোল ক্রমানুসারে"}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="no-print flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            {error}
          </div>
        )}

        {/* Main Result Sheet Table Component */}
        <div className="print-area overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          {/* Printable Formal Header */}
          <div className="mb-6 hidden text-center print-area print:block">
            <h1 className="text-2xl font-black uppercase tracking-wide">
              শ্রেণীভিত্তিক ফলাফল ও মেধা তালিকা
            </h1>
            <p className="mt-1 text-xs text-slate-600">
              শ্রেণী:{" "}
              <span className="font-bold">
                {data?.classInfo?.className || className}
              </span>{" "}
              {(data?.classInfo?.sectionName || sectionName) &&
                `| শাখা: ${data?.classInfo?.sectionName || sectionName}`}{" "}
              | সেমিস্টার:{" "}
              <span className="font-bold">{data?.semesterInfo?.name}</span>
            </p>
            <div className="mt-3 border-b-2 border-slate-800" />
          </div>

          {loading ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 text-slate-500">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <p className="text-xs font-bold">ফলাফল শীট লোড হচ্ছে...</p>
            </div>
          ) : processedStudents.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-slate-400">
              <FileSpreadsheet className="h-10 w-10 text-slate-300" />
              <p className="text-xs font-bold text-slate-600">
                কোনো শিক্ষার্থীর ফলাফল খুঁজে পাওয়া যায়নি।
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase font-bold tracking-wider">
                    <th className="p-3 text-center w-12">স্থান</th>
                    <th className="p-3 text-center w-14">রোল</th>
                    <th className="p-3 min-w-[160px]">শিক্ষার্থীর নাম</th>

                    {/* Dynamic Subject Columns */}
                    {data?.subjects?.map((sub) => (
                      <th
                        key={sub.id}
                        className="p-3 text-center min-w-[85px] border-l border-slate-100"
                      >
                        <div className="font-black text-slate-800">
                          {sub.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          ({sub.maxMarks})
                        </div>
                      </th>
                    ))}

                    <th className="p-3 text-center border-l border-slate-200 bg-slate-100/50">
                      মোট নম্বর
                    </th>
                    <th className="p-3 text-center">GPA</th>
                    <th className="p-3 text-center">গ্রেড</th>
                    <th className="p-3 text-center">স্ট্যাটাস</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {processedStudents.map((std, idx) => {
                    const isFailed = std.grade === "F";

                    return (
                      <tr
                        key={std.resultId || std.id || idx}
                        className={`hover:bg-slate-50/80 transition ${
                          isFailed ? "bg-rose-50/20" : ""
                        }`}
                      >
                        {/* Merit Rank Badge */}
                        <td className="p-3 text-center">
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${
                              std.position === 1
                                ? "bg-amber-100 text-amber-800 ring-2 ring-amber-300"
                                : std.position === 2
                                ? "bg-slate-200 text-slate-800"
                                : std.position === 3
                                ? "bg-amber-700/10 text-amber-900"
                                : "text-slate-600"
                            }`}
                          >
                            {std.position || "-"}
                          </span>
                        </td>

                        {/* Roll */}
                        <td className="p-3 text-center font-bold text-slate-700">
                          {std.roll || "-"}
                        </td>

                        {/* Name */}
                        <td className="p-3 font-bold text-slate-800">
                          {std.name}
                        </td>

                        {/* Dynamic Subject Marks */}
                        {data?.subjects?.map((sub) => {
                          const subData = std.subjects?.[sub.id];
                          if (!subData) {
                            return (
                              <td
                                key={sub.id}
                                className="p-3 text-center text-slate-300 border-l border-slate-100"
                              >
                                -
                              </td>
                            );
                          }

                          const isSubjectFailed =
                            subData.status === "FAIL" || subData.grade === "F";

                          return (
                            <td
                              key={sub.id}
                              className={`p-3 text-center border-l border-slate-100 font-bold ${
                                isSubjectFailed
                                  ? "text-rose-600 bg-rose-50/50"
                                  : "text-slate-700"
                              }`}
                            >
                              {subData.mark}{" "}
                              <span className="text-[10px] font-normal text-slate-400">
                                ({subData.grade || "-"})
                              </span>
                            </td>
                          );
                        })}

                        {/* Aggregates */}
                        <td className="p-3 text-center font-black text-slate-900 border-l border-slate-200 bg-slate-50/30">
                          {std.totalMarks || 0}
                        </td>
                        <td className="p-3 text-center font-black text-blue-600">
                          {std.gpa ? Number(std.gpa).toFixed(2) : "0.00"}
                        </td>
                        <td className="p-3 text-center font-black text-slate-800">
                          {std.grade || "F"}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              isFailed
                                ? "bg-rose-100 text-rose-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {isFailed ? "অনুত্তীর্ণ" : "উত্তীর্ণ"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}