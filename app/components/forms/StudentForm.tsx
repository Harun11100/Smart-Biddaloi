'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import axios from "axios";
import { useEffect, useState } from "react";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  roll: z.string().min(1, { message: "Roll/ID is required!" }),
  classId: z.string().min(1, { message: "Class is required!" }),
  section: z.string().optional(),
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

type Inputs = z.infer<typeof schema>;

interface ClassOption {
  _id: string;
  className: string;
  sectionName?: string;
}

interface StudentFormProps {
  type: "create";
  data?: Partial<Inputs>;
  onSubmit?: (values: Inputs, resetForm: () => void) => void;
  loading?: boolean;
  schoolId: string;
}

const StudentForm = ({ type, data, loading, schoolId, onSubmit }: StudentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [fetchingClasses, setFetchingClasses] = useState(false);

  // Fetch classes from database
  const fetchClassesFromDb = async () => {
    if (!schoolId) return;
    setFetchingClasses(true);
    try {
      const res = await axios.get(`/api/school/class/getClass?schoolId=${schoolId}`);
      setClasses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
      alert("Failed to fetch classes.");
    } finally {
      setFetchingClasses(false);
    }
  };

  useEffect(() => {
    if (schoolId) fetchClassesFromDb();
  }, [schoolId]);

  const submitHandler = async (values: Inputs) => {
    try {
      const payload = { ...values, schoolId };
      const res = await axios.post("/api/school/student/addStudent", payload);

      if (res.data.success) {
        alert("Student successfully added!");
        reset();
        if (onSubmit) onSubmit(values, reset);
      } else {
        alert(res.data.message || "Failed to create student.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(submitHandler)}>
      <h1 className="text-xl font-semibold">Add New Student</h1>

      <div className="flex flex-wrap gap-4">
        <InputField label="Full Name" name="name" register={register} defaultValue={data?.name} error={errors.name} />
        <InputField label="Roll/ID" name="roll" register={register} defaultValue={data?.roll} error={errors.roll} />

        {/* Class Selection */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId || ""}
            disabled={fetchingClasses}
          >
            <option value="">Select a class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.className} {cls.sectionName ? `(${cls.sectionName})` : ""}
              </option>
            ))}
          </select>
          {errors.classId && <p className="text-xs text-red-400">{errors.classId.message}</p>}
        </div>

        <InputField label="Section" name="section" register={register} defaultValue={data?.section} error={errors.section} />
        <InputField label="Guardian Name" name="guardianName" register={register} defaultValue={data?.guardianName} error={errors.guardianName} />
        <InputField label="Guardian Phone" name="guardianPhone" register={register} defaultValue={data?.guardianPhone} error={errors.guardianPhone} />
        <InputField label="Tuition Fee" name="tuitionFee" type="number" register={register} defaultValue={data?.tuitionFee} error={errors.tuitionFee} />
        <InputField label="Coaching Fee" name="coachingFee" type="number" register={register} defaultValue={data?.coachingFee} error={errors.coachingFee} />
        <InputField label="Address" name="address" register={register} defaultValue={data?.address} error={errors.address} />
        <InputField label="Remarks" name="remarks" register={register} defaultValue={data?.remarks} error={errors.remarks} />

        {/* Gender */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Gender</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("gender")} defaultValue={data?.gender || "male"}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className="text-xs text-red-400">{errors.gender.message}</p>}
        </div>

        {/* Blood Group */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Blood Group</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("bloodGroup")} defaultValue={data?.bloodGroup || ""}>
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
        className={`bg-blue-500 text-white p-2 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading}
      >
        {type === "create" ? "Add Student" : "Update Student"}
      </button>
    </form>
  );
};

export default StudentForm;
