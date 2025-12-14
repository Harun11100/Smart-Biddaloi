'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FormModal from "@/app/components/FormModal";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import Pagination from "@/app/components/Pagination";
import { TrashIcon, EyeIcon, PlusIcon } from "@heroicons/react/24/solid";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Roll", accessor: "roll" },
  { header: "Class", accessor: "className" },
  { header: "Section", accessor: "section" },
  { header: "Actions", accessor: "action" },
];

export default function StudentListClient({ students, schoolId, classId }) {
  const [studentData, setStudentData] = useState(students);
  const [loadingDelete, setLoadingDelete] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    setLoadingDelete(id);
    try {
      const res = await fetch(`/api/school/deleteStudent/${id}`, {
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

  const renderRow = (item) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 hover:bg-gray-50 text-sm rounded-lg"
    >
      <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
      <td className="py-3 px-4 text-gray-600">{item.roll}</td>
      <td className="py-3 px-4 text-gray-600">{item.className}</td>
      <td className="py-3 px-4 text-gray-600">{item.section || "N/A"}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Link href={`/list/students/${item._id}`}>
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition">
              <EyeIcon className="w-4 h-4" />
            </button>
          </Link>

          <button
            onClick={() => handleDelete(item._id)}
            disabled={loadingDelete === item._id}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition text-white ${
              loadingDelete === item._id
                ? "bg-gray-400"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loadingDelete === item._id ? "..." : <TrashIcon className="w-4 h-4" />}
          </button>

          <FormModal table="student" type="delete" id={item._id} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <TableSearch />
        <div className="flex items-center gap-3">
          <FormModal schoolId={schoolId} table="student" type="create" />
          <button className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition">
            <PlusIcon className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} renderRow={renderRow} data={studentData} />

      {/* Pagination */}
      {/* <Pagination /> */}
    </div>
  );
}
