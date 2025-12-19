"use client";

import { useState } from "react";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";
import { PlusIcon } from "lucide-react";
import FormModal from "@/app/components/FormModal";
import Table from "@/app/components/Table";

const columns = [
  { header: "Title", accessor: "title" },
  { header: "Description", accessor: "description", className: "hidden md:table-cell" },
  { header: "Due Date", accessor: "dueDate", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

export default function HomeworkClient({ initialHomework, schoolId, classId }) {
  const [homework, setHomework] = useState(initialHomework || []);
  const [loadingDelete, setLoadingDelete] = useState(null);

  const handleDeleteHomework = async (homeworkId) => {
    if (!confirm("Are you sure you want to delete this homework?")) return;

    setLoadingDelete(homeworkId);
    try {
      const res = await axios.delete("/api/teacher/Homework/deleteHomework", {
        data: { homeworkId },
      });

      if (res.data.success) {
        setHomework((prev) => prev.filter((h) => h._id !== homeworkId));
      } else {
        alert(res.data.message || "Failed to delete homework");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete homework");
    } finally {
      setLoadingDelete(null);
    }
  };

  const renderRow = (item) => (
    <tr key={item._id} className="border-b border-gray-200 even:bg-gray-50 hover:bg-gray-100 transition">
      <td className="px-4 py-3 font-medium">{item.title}</td>
      <td className="px-4 py-3 hidden md:table-cell">{item.description}</td>
      <td className="px-4 py-3 hidden lg:table-cell">{new Date(item.dueDate).toLocaleDateString()}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <FormModal
            table="homework"
            type="update"
            data={item}
            schoolId={schoolId}
            classId={classId}
            onSuccess={(updated) =>
              setHomework((prev) =>
                prev.map((h) => (h._id === updated._id ? updated : h))
              )
            }
          />
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-300 transition"
            onClick={() => handleDeleteHomework(item._id)}
            disabled={loadingDelete === item._id}
          >
            {loadingDelete === item._id ? "..." : <AiOutlineDelete size={16} />}
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md m-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">All Homework</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
           
          <FormModal schoolId={schoolId} classId={classId} table="homework" type="create" onSuccess={(newHomework) => setHomework((prev) => [newHomework, ...prev])}/>
           <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg ">
             Add Teacher
           </div>
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} renderRow={renderRow} data={homework} loading={false} />
    </div>
  );
}
