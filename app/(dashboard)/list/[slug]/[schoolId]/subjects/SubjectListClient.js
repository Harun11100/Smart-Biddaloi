'use client';

import { useState } from "react";
import FormModal from "@/app/components/FormModal";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import Image from "next/image";
import { IoTrashOutline } from "react-icons/io5";

const columns = [
  { header: "Subject Name", accessor: "name" },
  { header: "Code", accessor: "code" },
  { header: "Credit Hours", accessor: "creditHours", className: "hidden md:table-cell" },
  { header: "Max Marks", accessor: "maxMarks", className: "hidden md:table-cell" },
  { header: "Passing Marks", accessor: "passingMarks", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

export default function SubjectListClient({ subjects, schoolId }) {
  const [subjectList, setSubjectList] = useState(subjects);
  const [loadingDelete, setLoadingDelete] = useState(null);

  // ---------- DELETE ----------
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      deleteSubject(id);
    }
  };

  const deleteSubject = async (subjectId) => {
    setLoadingDelete(subjectId);
    try {
      const res = await fetch(`/api/school/subject/deleteSubject?subjectId=${subjectId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to delete.");
      } else {
        // Remove from local state
        setSubjectList((prev) => prev.filter((s) => s._id !== subjectId));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete.");
    } finally {
      setLoadingDelete(null);
    }
  };

  // ---------- RENDER ROW ----------
  const renderRow = (item) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-gray-50 hover:bg-purple-50 transition-colors duration-150"
    >
      <td className="p-4 font-semibold text-gray-800">{item.name}</td>
      <td className="uppercase text-gray-600">{item.code}</td>
      <td className="hidden md:table-cell text-gray-700">{item.creditHours ?? 0}</td>
      <td className="hidden md:table-cell text-gray-700">{item.maxMarks ?? 100}</td>
      <td className="hidden md:table-cell text-gray-700">{item.passingMarks ?? 33}</td>
      <td className="flex items-center gap-2">
        <FormModal
          table="subject"
          type="update"
          data={item}
          schoolId={schoolId}
          onSuccess={(updatedSubject) =>
            setSubjectList((prev) =>
              prev.map((s) => (s._id === updatedSubject._id ? updatedSubject : s))
            )
          }
        />
        <button
          onClick={() => handleDelete(item._id)}
          disabled={loadingDelete === item._id}
          className="p-2 rounded-lg border border-red-300 hover:bg-red-50 transition-all"
        >
          {loadingDelete === item._id ? (
            <span className="text-red-600 text-xs">Deleting...</span>
          ) : (
            <IoTrashOutline size={18} className="text-red-500" />
          )}
        </button>
      </td>
    </tr>
  );

  return (
    <div className="flex-1 m-4 mt-0 p-6 bg-white rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Subjects Overview
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />

          <div className="flex items-center gap-3">
            {/* <button className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 transition">
              <Image src="/filter.png" alt="Filter" width={16} height={16} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 transition">
              <Image src="/sort.png" alt="Sort" width={16} height={16} />
            </button> */}

            <FormModal
              table="subject"
              type="create"
              schoolId={schoolId}
              onSuccess={(newSubject) =>
                setSubjectList((prev) => [newSubject, ...prev])
              }
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
        <Table columns={columns} renderRow={renderRow} data={subjectList} />
      </div>
    </div>
  );
}
