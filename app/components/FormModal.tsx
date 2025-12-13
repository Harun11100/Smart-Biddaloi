'use client';

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});

interface FormModalProps {
  schoolId: string;
  onSuccess?: () => void;
}

const FormModal = ({ schoolId, onSuccess }: FormModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any, resetForm: () => void) => {
    setLoading(true);
    try {
      // Ensure required fields exist
      const payload = {
        name: values.name,
        userName: values.userName || "",
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: values.role,
        schoolId,
        classTeacher: values.classTeacher || "",
        subjects: values.subjects?.split(",").map((s: string) => s.trim()) || [],
        gender: values.gender || "male",
        address: values.address || "",
        bloodGroup: values.bloodGroup || "",
        nid: values.nid || "",
      };

      console.log("Submitting payload:", payload)

      const res = await axios.post("/api/school/createTeacher", payload);

      if (res.data.success) {
        alert("শিক্ষক সফলভাবে যুক্ত হয়েছে");
        resetForm();
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        alert(res.data.message || "শিক্ষক যুক্ত করতে সমস্যা হয়েছে");
      }
    } catch (err) {
      console.error(err);
      alert("কিছু সমস্যা হয়েছে, পুনরায় চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
        onClick={() => setOpen(true)}
      >
        <Image src="/create.png" alt="Create" width={16} height={16} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <TeacherForm type="create" onSubmit={handleSubmit} loading={loading} />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="Close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
