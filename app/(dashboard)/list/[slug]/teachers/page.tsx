'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import FormModal from "@/app/components/FormModal";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import Pagination from "@/app/components/Pagination";
import AdminDashboardLayout from "@/app/components/admin/layout/AdminDashboardLayout";

type Teacher = {
  _id: string;
  classTeacher?: string;
  name: string;
  email?: string;
  phone: string;
  role: string;
  subjects: string[];
  totalPresentDays?: { month: string; year: string; days: number }[];
  schoolId: string;
  expoToken?: string | null;
  loginOTP?: string | null;
  loginOTPExpiry?: string | null;
  address?: string;
  photo?: string;
  classes?: string[];
};

const columns = [
  { header: "Info", accessor: "info" },
  { header: "Teacher ID", accessor: "teacherId", className: "hidden md:table-cell" },
  { header: "Subjects", accessor: "subjects", className: "hidden md:table-cell" },
  { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const TeacherListPage = () => {
  const params = useParams();
  const router = useRouter();

  // Slug for routes
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug ?? "";

  const [schoolDetails, setSchoolDetails] = useState<{ schoolId: string } | null>(null);
  const schoolId = schoolDetails?.schoolId ?? "";

  const [teacherData, setTeacherData] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);

  // Load school details from localStorage
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

  // Fetch teacher data
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

  // Delete teacher
  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি এই শিক্ষককে মুছে ফেলতে চান?")) return;

    setLoadingDelete(id);
    try {
      const res = await axios.delete(`/api/school/deleteTeacher/${id}`);
      if (res.data.success) {
        setTeacherData((prev) => prev.filter((t) => t._id !== id));
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

  // Render a table row
  const renderRow = (item: Teacher) => (
    <tr key={item._id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">
        {item.photo && (
          <Image src={item.photo} alt={item.name} width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover" />
        )}
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.nid||""}</td>
      <td className="hidden md:table-cell">{item.subjects.join(", ")}</td>
      <td className="hidden md:table-cell">{item.classes?.join(", ")}</td>
      <td className="hidden lg:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/${slug}/teachers/${item._id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="View" width={16} height={16} />
            </button>
          </Link>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple"
            onClick={() => handleDelete(item._id)}
            disabled={loadingDelete === item._id}
          >
            {loadingDelete === item._id ? "..." : <Image src="/delete.png" alt="Delete" width={16} height={16} />}
          </button>
          <FormModal table="teacher" type="delete" id={item._id} />
        </div>
      </td>
    </tr>
  );

  return (
    
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/filter.png" alt="Filter" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/sort.png" alt="Sort" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow" 
              >
                <Image src="/plus.png" alt="Add" width={14} height={14} />
              </button>
              <FormModal   schoolId={schoolId} />
            </div>
          </div>
        </div>

        {/* LIST */}
        <Table columns={columns} renderRow={renderRow} data={teacherData} />

        {/* PAGINATION */}
        <Pagination />
      </div>
    
  );
};

export default TeacherListPage;
