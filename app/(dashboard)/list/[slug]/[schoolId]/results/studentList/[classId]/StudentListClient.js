"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FormModal from "@/app/components/FormModal";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { TrashIcon, EyeIcon, PlusIcon } from "@heroicons/react/24/solid";
import FormUpdateModal from "@/app/components/FormUpdateModal";
import { CloudUploadIcon, UploadIcon } from "lucide-react";
import ResultModal from "@/app/components/ResultModal";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Roll", accessor: "roll" },
  { header: "Class", accessor: "className" },
  { header: "Section", accessor: "section" },
  { header: "Actions", accessor: "action" },

];

export default function StudentListClient({ students, schoolId, classId,className,sectionName, slug }) {
  const [studentData, setStudentData] = useState(students);
  const [loadingDelete, setLoadingDelete] = useState(null);



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
        <TableSearch />
      </div>

      {/* Table */}
      <Table columns={columns} renderRow={renderRow} data={studentData} />

      {/* Pagination Placeholder */}
      {/* <Pagination /> */}
    </div>
  );
}
