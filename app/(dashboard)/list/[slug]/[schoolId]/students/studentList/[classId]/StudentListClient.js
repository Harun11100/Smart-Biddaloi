"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import FormModal from "@/app/components/FormModal";
import FormUpdateModal from "@/app/components/FormUpdateModal";
import RollFilter from "@/app/components/RollFilter";
import Table from "@/app/components/Table";
import { filterStudentsByRollAndStatus } from "@/app/utils/filterStudents";

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
  const [activeFilter, setActiveFilter] = useState("all");
  const [loadingDelete, setLoadingDelete] = useState(null);

  // Apply filtering whenever students, rollQuery, or activeFilter changes
  useEffect(() => {
    const result = filterStudentsByRollAndStatus({
      students: studentData,
      rollQuery,
      status: activeFilter,
    });
    setFiltered(result);
  }, [studentData, rollQuery, activeFilter]);

  // Delete student
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    setLoadingDelete(id);
    try {
      const res = await fetch(`/api/school/student/deleteStudent/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setStudentData((prev) => prev.filter((s) => s._id !== id));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting");
    } finally {
      setLoadingDelete(null);
    }
  };

  // Render table row
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
          <Link href={`/list/${slug}/${schoolId}/students/${item._id}`}>
            <button className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition shadow-md">
              <EyeIcon className="w-4 h-4" />
            </button>
          </Link>

          <button
            onClick={() => handleDelete(item._id)}
            disabled={loadingDelete === item._id}
            className={`flex items-center justify-center w-9 h-9 rounded-full transition shadow-md text-white ${
              loadingDelete === item._id
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loadingDelete === item._id ? "..." : <TrashIcon className="w-4 h-4" />}
          </button>

          <FormUpdateModal studentId={item._id} schoolId={schoolId} data={item} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Student List</h1>
        <p className="text-gray-600 mb-1">
          Class: {className || "N/A"} | Section: {sectionName || "N/A"}
        </p>
        <p className="text-gray-600 mb-4">Total Students: {studentData.length}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <RollFilter value={rollQuery} onChange={setRollQuery} className="w-40" />
          <div className="flex gap-2">
            {["all", "paid", "unpaid"].map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
                  activeFilter === status
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p>Add Student</p>
          <FormModal schoolId={schoolId} table="student" type="create" />
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} renderRow={renderRow} data={filtered} />
    </div>
  );
}
