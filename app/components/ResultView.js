"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
X,
CalendarDays,
CheckCircle2,
Search,
GraduationCap,
ChartLine,
Hash,
Percent,
Info,
Clock3,
BadgeCheck,
BookOpen,
Trophy,
} from "lucide-react";

export default function StudentResultView({
schoolId,
studentId,
classId,
onClose,
}) {
const [semesters, setSemesters] = useState([]);
const [selectedSemester, setSelectedSemester] = useState("");
const [result, setResult] = useState(null);

const [semesterLoading, setSemesterLoading] = useState(true);
const [loading, setLoading] = useState(false);
const [btnLoading, setBtnLoading] = useState(false);
const [error, setError] = useState("");

// =====================================================
// FETCH SEMESTERS
// =====================================================

const fetchSemesters = async () => {
if (!schoolId) return;

setSemesterLoading(true);
setError("");

try {
  const res = await axios.get(
    "/api/school/semester/getSemesters",
    {
      params: {
        schoolId,
      },
    }
  );

  const data = Array.isArray(res.data?.data)
    ? res.data.data
    : [];

  setSemesters(data);

  if (data.length > 0) {
    setSelectedSemester(data[0]._id);
  }
} catch (error) {
  console.error(
    "❌ Semester fetch error:",
    error?.response?.data || error.message
  );

  setError("সেমিস্টারের তথ্য লোড করা যায়নি।");
} finally {
  setSemesterLoading(false);
}


};

// =====================================================
// FETCH STUDENT RESULT
// =====================================================

const fetchStudentResult = async (semesterId) => {
if (!schoolId || !studentId || !semesterId) {
return;
}


setLoading(true);
setError("");

try {
  const res = await axios.get(
    "/api/school/results/getSemesterResult",
    {
      params: {
        schoolId,
        studentId,
        semesterId,
      },
    }
  );

  const fetchedResult = res.data?.data || null;

  setResult(fetchedResult);
} catch (error) {
  console.error(
    "❌ Result fetch error:",
    error?.response?.data || error.message
  );

  setResult(null);

  if (error?.response?.status === 404) {
    setError("");
  } else {
    setError("ফলাফল লোড করা যায়নি।");
  }
} finally {
  setLoading(false);
  setBtnLoading(false);
}

};

// =====================================================
// INITIAL LOAD
// =====================================================

useEffect(() => {
fetchSemesters();
}, [schoolId]);

// =====================================================
// SEARCH
// =====================================================

const handleSearch = async () => {
if (!selectedSemester) {
setError("সেমিস্টার নির্বাচন করুন!");
return;
}


setBtnLoading(true);

await fetchStudentResult(selectedSemester);


};

// =====================================================
// SEMESTER CHANGE
// =====================================================

const handleSemesterChange = (e) => {
const value = e.target.value;

setSelectedSemester(value);
setResult(null);
setError("");


};

// =====================================================
// SELECTED SEMESTER
// =====================================================

const selectedSemesterData = semesters.find(
(semester) => semester._id === selectedSemester
);

// =====================================================
// SUBJECT RESULTS
// =====================================================

const subjectResults = Array.isArray(result?.subjects)
? result.subjects
: [];

// =====================================================
// TOTAL MARKS
// =====================================================

const calculatedTotalMarks = useMemo(() => {
return subjectResults.reduce((total, subject) => {
return total + Number(subject.totalMarks ?? 0);
}, 0);
}, [subjectResults]);

// =====================================================
// TOTAL POSSIBLE MARKS
// =====================================================

const calculatedTotalPossibleMarks = useMemo(() => {
return subjectResults.reduce((total, subject) => {
return total + Number(subject.maxMarks ?? 0);
}, 0);
}, [subjectResults]);

// =====================================================
// PERCENTAGE
// =====================================================

const calculatedAverage =
calculatedTotalPossibleMarks > 0
? (calculatedTotalMarks /
calculatedTotalPossibleMarks) *
100
: 0;

// =====================================================
// GPA
// =====================================================

const calculatedGPA =
subjectResults.length > 0
? subjectResults.reduce((total, subject) => {
return total + Number(subject.gpa ?? 0);
}, 0) / subjectResults.length
: 0;

// =====================================================
// FAILED SUBJECTS
// =====================================================

const failedSubjects = subjectResults.filter((subject) => {
const mark = Number(subject.totalMarks ?? 0);
const passingMarks = Number(
subject.passingMarks ?? 0
);


return (
  mark < passingMarks ||
  subject.grade === "F"
);


});

// =====================================================
// CLOSE
// =====================================================

const handleClose = () => {
if (onClose) {
onClose();
}
};

// =====================================================
// RENDER
// =====================================================

return ( <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-3xl bg-[#f7f9fc]">


  {/* =================================================
      MODAL HEADER
  ================================================= */}

  <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#173f9f] via-[#2858c7] to-[#4f8df7] px-5 py-5 text-white sm:px-7">

    {/* Decorative circles */}

    <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/10" />

    <div className="absolute -bottom-16 left-20 h-36 w-36 rounded-full bg-white/5" />

    <div className="relative flex items-center justify-between gap-4">

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner backdrop-blur-sm">
          <GraduationCap size={26} />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-extrabold sm:text-xl">
            শিক্ষার্থীর ফলাফল
          </h1>

          <p className="mt-0.5 text-xs text-blue-100 sm:text-sm">
            সেমিস্টার ভিত্তিক একাডেমিক ফলাফল
          </p>
        </div>
      </div>

      {onClose && (
        <button
          onClick={handleClose}
          aria-label="Close"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <X size={20} />
        </button>
      )}
    </div>
  </div>

  {/* =================================================
      SCROLLABLE CONTENT
  ================================================= */}

  <div className="min-h-0 flex-1 overflow-y-auto">

    <div className="space-y-4 p-4 sm:p-6">

      {/* =================================================
          SEMESTER SELECTOR
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="mb-3 flex items-center gap-2">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
            <CalendarDays
              size={17}
              className="text-blue-600"
            />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800">
              সেমিস্টার নির্বাচন
            </p>

            <p className="text-[11px] text-slate-400">
              যে সেমিস্টারের ফলাফল দেখতে চান
            </p>
          </div>

        </div>

        {semesterLoading ? (
          <div className="flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-50 text-sm text-slate-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            সেমিস্টার লোড হচ্ছে...
          </div>
        ) : semesters.length === 0 ? (
          <div className="flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-50 text-sm text-slate-500">
            <Info size={17} />
            কোনো সেমিস্টার পাওয়া যায়নি।
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row">

            <select
              id="semester"
              value={selectedSemester}
              onChange={handleSemesterChange}
              className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
            >
              <option value="">
                সেমিস্টার নির্বাচন করুন
              </option>

              {semesters.map((semester) => (
                <option
                  key={semester._id}
                  value={semester._id}
                >
                  {semester.name} -{" "}
                  {semester.academicYear}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              disabled={btnLoading}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[155px]"
            >
              {btnLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  লোড হচ্ছে...
                </>
              ) : (
                <>
                  <Search size={18} />
                  ফলাফল দেখুন
                </>
              )}
            </button>

          </div>
        )}
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          <Info size={18} />
          {error}
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
            <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-600">
            ফলাফল লোড হচ্ছে...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            অনুগ্রহ করে একটু অপেক্ষা করুন
          </p>

        </div>
      )}

      {/* =================================================
          RESULT
      ================================================= */}

      {!loading && result && (
        <div className="space-y-4">

          {/* =================================================
              RESULT TITLE
          ================================================= */}

          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                <BookOpen
                  size={21}
                  className="text-indigo-600"
                />
              </div>

              <div>
                <h2 className="text-base font-extrabold text-slate-800 sm:text-lg">
                  {selectedSemesterData?.name ||
                    "Semester Result"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  {selectedSemesterData?.academicYear ||
                    ""}
                </p>
              </div>

            </div>

            <div
              className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                result.status === "published"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {result.status === "published" ? (
                <CheckCircle2 size={16} />
              ) : (
                <Clock3 size={16} />
              )}

              {result.status === "published"
                ? "ফলাফল প্রকাশিত"
                : "অপ্রকাশিত"}
            </div>

          </div>

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

            {/* GPA */}

            <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                <ChartLine
                  size={18}
                  className="text-blue-600"
                />
              </div>

              <p className="mt-3 text-xs font-semibold text-slate-400">
                GPA
              </p>

              <p className="mt-1 text-2xl font-black text-slate-800">
                {calculatedGPA.toFixed(2)}
              </p>

            </div>

            {/* TOTAL */}

            <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                <Hash
                  size={18}
                  className="text-emerald-600"
                />
              </div>

              <p className="mt-3 text-xs font-semibold text-slate-400">
                মোট নম্বর
              </p>

              <p className="mt-1 text-2xl font-black text-slate-800">
                {calculatedTotalMarks}
                <span className="ml-1 text-sm font-semibold text-slate-400">
                  /{calculatedTotalPossibleMarks}
                </span>
              </p>

            </div>

            {/* PERCENTAGE */}

            <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-4">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100">
                <Percent
                  size={18}
                  className="text-purple-600"
                />
              </div>

              <p className="mt-3 text-xs font-semibold text-slate-400">
                গড় নম্বর
              </p>

              <p className="mt-1 text-2xl font-black text-slate-800">
                {calculatedAverage.toFixed(1)}
                <span className="text-base">
                  %
                </span>
              </p>

            </div>

            {/* SUBJECT */}

            <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-4">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100">
                <Trophy
                  size={18}
                  className="text-orange-600"
                />
              </div>

              <p className="mt-3 text-xs font-semibold text-slate-400">
                বিষয়
              </p>

              <p className="mt-1 text-2xl font-black text-slate-800">
                {subjectResults.length}
              </p>

              {failedSubjects.length > 0 && (
                <p className="text-[11px] font-semibold text-red-500">
                  {failedSubjects.length}টি বিষয়ে ফেল
                </p>
              )}

            </div>

          </div>

          {/* =================================================
              SUBJECT RESULTS
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">

              <div>
                <h3 className="text-base font-extrabold text-slate-800">
                  বিষয়ভিত্তিক ফলাফল
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                  প্রতিটি বিষয়ের নম্বর ও গ্রেড
                </p>
              </div>

              <div className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-blue-50 px-2 text-xs font-bold text-blue-600">
                {subjectResults.length}
              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px] border-collapse">

                <thead>
                  <tr className="bg-slate-50">

                    <th className="px-4 py-3 text-left text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      বিষয়
                    </th>

                    <th className="px-4 py-3 text-center text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      প্রাপ্ত
                    </th>

                    <th className="px-4 py-3 text-center text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      সর্বোচ্চ
                    </th>

                    <th className="px-4 py-3 text-center text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      পাশ
                    </th>

                    <th className="px-4 py-3 text-center text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      গ্রেড
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {subjectResults.map(
                    (item, index) => {

                      const mark =
                        Number(
                          item.totalMarks ?? 0
                        );

                      const maxMarks =
                        Number(
                          item.maxMarks ?? 0
                        );

                      const passingMarks =
                        Number(
                          item.passingMarks ?? 0
                        );

                      const isFailed =
                        mark < passingMarks ||
                        item.grade === "F";

                      return (
                        <tr
                          key={
                            item.subjectId
                              ?._id ||
                            item.subjectId ||
                            index
                          }
                          className="transition hover:bg-slate-50"
                        >

                          <td className="px-4 py-3.5">

                            <div className="flex items-center gap-3">

                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                  isFailed
                                    ? "bg-red-50 text-red-600"
                                    : "bg-blue-50 text-blue-600"
                                }`}
                              >
                                {index + 1}
                              </div>

                              <span className="text-sm font-semibold text-slate-700">
                                {item.subjectName ||
                                  "বিষয়"}
                              </span>

                            </div>

                          </td>

                          <td
                            className={`px-4 py-3.5 text-center text-sm font-bold ${
                              isFailed
                                ? "text-red-600"
                                : "text-slate-700"
                            }`}
                          >
                            {mark}
                          </td>

                          <td className="px-4 py-3.5 text-center text-sm text-slate-500">
                            {maxMarks}
                          </td>

                          <td className="px-4 py-3.5 text-center text-sm text-slate-500">
                            {passingMarks}
                          </td>

                          <td className="px-4 py-3.5 text-center">

                            <span
                              className={`inline-flex min-w-[42px] items-center justify-center rounded-lg px-2.5 py-1 text-xs font-extrabold ${
                                isFailed
                                  ? "bg-red-50 text-red-600"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {item.grade || "-"}
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

              {subjectResults.length === 0 && (
                <div className="flex flex-col items-center justify-center px-5 py-12 text-center">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                    <Info
                      size={21}
                      className="text-slate-400"
                    />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    কোনো বিষয়ের ফলাফল পাওয়া যায়নি
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    ফলাফল প্রকাশের পর এখানে দেখা যাবে।
                  </p>

                </div>
              )}

            </div>
          </div>

          {/* =================================================
              RESULT STATUS
          ================================================= */}

          <div
            className={`flex items-center gap-3 rounded-2xl border p-4 ${
              result.status === "published"
                ? "border-emerald-100 bg-emerald-50/70"
                : "border-amber-100 bg-amber-50/70"
            }`}
          >

            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                result.status === "published"
                  ? "bg-emerald-100"
                  : "bg-amber-100"
              }`}
            >
              {result.status === "published" ? (
                <BadgeCheck
                  size={21}
                  className="text-emerald-600"
                />
              ) : (
                <Clock3
                  size={21}
                  className="text-amber-600"
                />
              )}
            </div>

            <div>

              <p
                className={`text-sm font-bold ${
                  result.status === "published"
                    ? "text-emerald-800"
                    : "text-amber-800"
                }`}
              >
                {result.status === "published"
                  ? "ফলাফল প্রকাশিত হয়েছে"
                  : "ফলাফল এখনো প্রকাশিত হয়নি"}
              </p>

              {result.publishedAt && (
                <p className="mt-1 text-xs text-slate-500">
                  প্রকাশের তারিখ:{" "}
                  {new Date(
                    result.publishedAt
                  ).toLocaleDateString(
                    "bn-BD"
                  )}
                </p>
              )}

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading &&
        !result &&
        !semesterLoading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm">

            <img
              src="/images/empty.png"
              alt="No result"
              className="h-40 w-40 object-contain sm:h-48 sm:w-48"
            />

            <h3 className="mt-2 text-base font-extrabold text-slate-700 sm:text-lg">
              কোনো ফলাফল পাওয়া যায়নি
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400 sm:text-sm">
              একটি সেমিস্টার নির্বাচন করে
              "ফলাফল দেখুন" বাটনে ক্লিক করুন।
            </p>

          </div>
        )}

    </div>
  </div>

  {/* =================================================
      MODAL FOOTER
  ================================================= */}

  <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 text-center sm:px-6">

    <p className="text-[11px] text-slate-400">
      ফলাফল সংক্রান্ত কোনো সমস্যা থাকলে
      কলেজ কর্তৃপক্ষের সাথে যোগাযোগ করুন।
    </p>

  </div>

</div>
)}