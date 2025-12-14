'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputField from "../InputField";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  roll: z.string().min(1, { message: "Roll/ID is required!" }),
  classId: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  dateOfBirth: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().min(1, { message: "Guardian phone is required!" }),
  bloodGroup: z.string().optional(),
  tuitionFee: z.string().optional(),
  coachingFee: z.string().optional(),
  address: z.string().optional(),
  remarks: z.string().optional(),
});

export default function StudentForm({ type, data, loading = false, schoolId, onSuccess }) {
  const [classes, setClasses] = useState([]);
  const [fetchingClasses, setFetchingClasses] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  useEffect(() => {
    if (!schoolId) return;

    const fetchClasses = async () => {
      setFetchingClasses(true);
      try {
        const res = await axios.get(`/api/school/class/getClass?schoolId=${schoolId}`);
        const classData = res.data.data || [];
        setClasses(classData);

        // Reset form after classes are loaded
        if (type === "update" && data) {
          reset({ ...data });
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
        alert("Failed to fetch classes.");
      } finally {
        setFetchingClasses(false);
      }
    };

    fetchClasses();
  }, [schoolId, data, type, reset]);

  const submitHandler = async (values) => {
    try {
      setSubmitting(true);

      const payload = {
        ...values,
        schoolId,
        ...(type === "update" ? { studentId: data?._id } : {}),
      };

      const url =
        type === "create"
          ? "/api/school/student/addStudent"
          : "/api/school/student/updateStudent";

      const res =
        type === "create"
          ? await axios.post(url, payload)
          : await axios.put(url, payload);

      if (res.data.success) {
        alert(type === "create" ? "Student created successfully!" : "Student updated successfully!");
        reset();
        onSuccess?.();
      } else {
        alert(res.data.message || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(submitHandler)}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Add New Student" : "Update Student"}</h1>

      <div className="flex flex-wrap gap-4">
        <InputField label="Full Name" name="name" register={register} defaultValue={data?.name} error={errors.name} />
        <InputField label="Roll/ID" name="roll" register={register} defaultValue={data?.roll} error={errors.roll} />

        {/* Class Selection */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          {fetchingClasses ? (
            <p>Loading classes...</p>
          ) : (
            <select
              {...register("classId")}
              defaultValue={data?.classId || ""}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className} {cls.sectionName ? `(${cls.sectionName})` : ""}
                </option>
              ))}
            </select>
          )}
          {errors.classId && <p className="text-xs text-red-400">{errors.classId.message}</p>}
        </div>

        <InputField label="Guardian Name" name="guardianName" register={register} defaultValue={data?.guardianName} error={errors.guardianName} />
        <InputField label="Guardian Phone" name="guardianPhone" register={register} defaultValue={data?.guardianPhone} error={errors.guardianPhone} />
        <InputField label="Tuition Fee" name="tuitionFee" type="number" register={register} defaultValue={data?.tuitionFee?.toString()} error={errors.tuitionFee} />
        <InputField label="Coaching Fee" name="coachingFee" type="number" register={register} defaultValue={data?.coachingFee?.toString()} error={errors.coachingFee} />
        <InputField label="Address" name="address" register={register} defaultValue={data?.address} error={errors.address} />
        <InputField label="Remarks" name="remarks" register={register} defaultValue={data?.remarks} error={errors.remarks} />

        {/* Gender */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Gender</label>
          <select {...register("gender")} defaultValue={data?.gender || "male"} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className="text-xs text-red-400">{errors.gender.message}</p>}
        </div>

        {/* Blood Group */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Blood Group</label>
          <select {...register("bloodGroup")} defaultValue={data?.bloodGroup || ""} className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full">
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          {errors.bloodGroup && <p className="text-xs text-red-400">{errors.bloodGroup.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || submitting}
        className={`bg-blue-500 text-white p-2 rounded-md flex items-center justify-center gap-2 transition ${loading || submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
      >
        {(loading || submitting) && <ClipLoader color="#fff" size={16} />}
        {type === "create" ? "Add Student" : "Update Student"}
      </button>
    </form>
  );
}
