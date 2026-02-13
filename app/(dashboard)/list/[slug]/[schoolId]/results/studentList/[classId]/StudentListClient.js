"use client";

import { useState, useEffect } from "react";
import Table from "@/app/components/Table";
import FormModal from "@/app/components/FormModal";
import FormUpdateModal from "@/app/components/FormUpdateModal";
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
  const [studentData, setStudentData] = useState(students);
  const [filtered, setFiltered] = useState(students);
  const [rollQuery, setRollQuery] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(null);

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

  const renderRow = (item) => (
    <tr
      key={item._id}
      className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
    >
      <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
      <td className="py-3 px-4 text-gray-600">{item.roll}</td>
      <td className="py-3 px-4 text-gray-600">{item.className}</td>
      <td className="py-3 px-4 text-gray-600">{item.section || "N/A"}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <ResultModal schoolId={schoolId} studentId={item._id} table="result" type="view" />
          <ResultModal schoolId={schoolId} studentId={item._id} table="result" type="create" />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <RollFilter
          value={rollQuery}
          onChange={setRollQuery}
          placeholder="Filter by Roll"
          className="w-40"
        />

        <div className="flex items-center gap-3">
          <p>Add Student</p>
          <FormModal schoolId={schoolId} table="student" type="create" />
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={filtered} />
    </div>
  );
}
