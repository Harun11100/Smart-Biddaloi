"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileSpreadsheet,
  ChevronRight,
} from "lucide-react";

import Table from "@/app/components/Table";
import FormModal from "@/app/components/FormModal";
import ResultModal from "@/app/components/ResultModal";
import RollFilter from "@/app/components/RollFilter";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Roll", accessor: "roll" },
  { header: "Class", accessor: "className" },
  { header: "Section", accessor: "section" },
  { header: "Actions", accessor: "action" },
];

export default function StudentListClient({
  students,
  schoolId,
  classId,
  className,
  sectionName,
  slug,
}) {
  const router = useRouter();

  const [studentData, setStudentData] = useState(students);
  const [filtered, setFiltered] = useState(students);
  const [rollQuery, setRollQuery] = useState("");

  // Filter students by roll number
  useEffect(() => {
    if (!rollQuery.trim()) {
      setFiltered(studentData);
    } else {
      setFiltered(
        studentData.filter((s) =>
          String(s.roll).includes(rollQuery.trim())
        )
      );
    }
  }, [rollQuery, studentData]);

  // Navigate to class result sheet
  const handleResultSheet = () => {
    const params = new URLSearchParams();

    if (schoolId) params.set("schoolId", schoolId);
    if (classId) params.set("classId", classId);
    if (className) params.set("className", className);
    if (sectionName) params.set("sectionName", sectionName);

    // router.push(`/result-sheet?${params.toString()}`);
    router.push(`/list/${slug}/${schoolId}/results/result-sheet?${params.toString()}`);
  };

  const renderRow = (item) => (
    <tr
      key={item._id}
      className="cursor-pointer transition-colors duration-200 hover:bg-gray-50"
    >
      <td className="px-4 py-3 font-medium text-gray-800">
        {item.name}
      </td>

      <td className="px-4 py-3 text-gray-600">
        {item.roll}
      </td>

      <td className="px-4 py-3 text-gray-600">
        {item.className}
      </td>

      <td className="px-4 py-3 text-gray-600">
        {item.section || "N/A"}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <ResultModal
            schoolId={schoolId}
            studentId={item._id}
            table="result"
            type="view"
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Students in {className} {sectionName || ""}
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Total Students: {studentData.length}
          </p>
        </div>

        {/* RESULT SHEET BUTTON */}

        <button
          type="button"
          onClick={handleResultSheet}
          className="
            group
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            px-5
            py-3
            text-sm
            font-bold
            text-white
            shadow-md
            shadow-blue-200
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:from-blue-700
            hover:to-indigo-700
            hover:shadow-lg
            sm:w-auto
          "
        >
          <span className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            bg-white/15
            transition
            group-hover:bg-white/20
          ">
            <FileSpreadsheet size={19} />
          </span>

          <span>
            Class Result Sheet
          </span>

          <ChevronRight
            size={17}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </div>

      {/* =========================================
          FILTER + ADD STUDENT
      ========================================= */}

      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">

        <RollFilter
          value={rollQuery}
          onChange={setRollQuery}
          placeholder="Filter by Roll"
          className="w-40"
        />

        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600">
            Add Student
          </p>

          <FormModal
            schoolId={schoolId}
            table="student"
            type="create"
          />
        </div>

      </div>

      {/* =========================================
          STUDENT TABLE
      ========================================= */}

      <Table
        columns={columns}
        renderRow={renderRow}
        data={filtered}
      />

    </div>
  );
}