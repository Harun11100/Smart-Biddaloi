'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/solid";

import FormModal from "@/app/components/FormModal";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";

const columns = [
  { header: "Info", accessor: "info" },
  { header: "Teacher ID", accessor: "teacherId", className: "hidden md:table-cell" },
  { header: "Subjects", accessor: "subjects", className: "hidden md:table-cell" },
  { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const TeacherListPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug ?? "";

  const [schoolDetails, setSchoolDetails] = useState(null);
  const schoolId = schoolDetails?.schoolId ?? "";

  const [teacherData, setTeacherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(null);
  console.log("Teachers data **************:",teacherData)
  useEffect(() => {
    const stored = localStorage.getItem("schoolDetails");
    if (stored) {
      const school = JSON.parse(stored);
      if (!school?.schoolId) {
        router.push("/sign-in-as-admin");
        return;
      }
      setSchoolDetails({ schoolId: school.schoolId });
    } else {
      router.push("/sign-in-as-admin");
    }
  }, [router]);

  const fetchTeacherData = async () => {
    if (!schoolId) return;
    try {
      const res = await axios.get(`/api/school/getTeachers?schoolId=${schoolId}`);
      if (res.data.success) setTeacherData(res.data.teachers || []);
    } catch (err) {
      console.error("Error fetching teacherData:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, [schoolId]);

  const handleDelete = async (id) => {
    if (!confirm("আপনি কি এই শিক্ষককে মুছে ফেলতে চান?")) return;

    setLoadingDelete(id);
    try {
      const res = await axios.delete(`/api/school/deleteTeacher/${id}`);
      if (res.data.success) {
        setTeacherData(prev => prev.filter(t => t._id !== id));
      } else {
        alert(res.data.message || "মুছে ফেলা ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("মুছে ফেলার সময় সমস্যা হয়েছে");
    } finally {
      setLoadingDelete(null);
    }
  };

  const renderRow = (item) => (
    <tr key={item._id} className="border-b border-gray-200 even:bg-gray-50 hover:bg-gray-100 transition">
      <td className="flex items-center gap-4 p-4">
        {item.photo && (
          <Image
            src={item.photo}
            alt={item.name}
            width={40}
            height={40}
            className="rounded-full object-cover w-10 h-10"
          />
        )}
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.nid}</td>
      <td className="hidden md:table-cell">{item.subjects.join(", ")}</td>
      <td className="hidden md:table-cell">{item.classTeacher}</td>
      <td className="hidden lg:table-cell">{item.phone}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/${slug}/${schoolId}/teachers/${item._id}`}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-300 transition">
              <Image src="/view.png" alt="View" width={16} height={16} />
            </button>
          </Link>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-300 transition"
            onClick={() => handleDelete(item._id)}
            disabled={loadingDelete === item._id}
          >
            {loadingDelete === item._id ? "..." : <Image src="/delete.png" alt="Delete" width={16} height={16} />}
          </button>
          <FormModal
            table="teacher"
            type="update"
            data={item}
            schoolId={schoolId}
            // onSuccess={(updatedTeacher) =>
            //   setTeacherData(prev => prev.map(t => (t._id === updatedTeacher._id ? updatedTeacher : t)))
            // }
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md m-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">All Teachers</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <TableSearch />
          {/* <button className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-200 hover:bg-yellow-300 transition">
            <Image src="/filter.png" alt="Filter" width={16} height={16} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-200 hover:bg-yellow-300 transition">
            <Image src="/sort.png" alt="Sort" width={16} height={16} />
          </button> */}
          <FormModal schoolId={schoolId} table="teacher" type="create"/>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition transform hover:-translate-y-1">
              <PlusIcon className="w-5 h-5" /> Add Teacher
            </div>
     
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} renderRow={renderRow} data={teacherData} loading={loading} />
    </div>
  );
};

export default TeacherListPage;
