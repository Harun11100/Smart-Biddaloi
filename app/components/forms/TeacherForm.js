"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import InputField from "../InputField";
import ClipLoader from "react-spinners/ClipLoader";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  userName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z.string().min(4, { message: "Pin must be at least 4 characters!" }),
  gender: z.enum(["male", "female"]).optional(),
  phone: z.string().min(1, { message: "Phone is required!" }),
  role: z.string().min(1, { message: "Role is required!" }),
  address: z.string().optional(),
  bloodGroup: z.string().optional(),
  nid: z.string().optional(),
  classTeacher: z.string().optional(),
  subjects: z.string().optional(),
});

const TeacherForm = ({ type, data = {}, loading = false, schoolId, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const submitHandler = async (values) => {
    try {
      const payload = {
        ...values,
        schoolId,
        subjects: values.subjects?.split(",").map((s) => s.trim()) || [],
        gender: values.gender || "male",
        ...(type === "update" ? { teacherId: data._id } : {}),
      };

      const url =
        type === "create"
          ? "/api/school/createTeacher"
          : `/api/school/editTeacher/${data._id}`;

      const res =
        type === "create"
          ? await axios.post(url, payload)
          : await axios.put(url, payload);

      if (res.data.success) {
        alert(type === "create" ? "Teacher created successfully!" : "Teacher updated successfully!");
        reset();
        onSuccess?.();
      } else {
        alert(res.data.message || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(submitHandler)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new teacher" : "Update teacher"}
      </h1>

      <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
      <div className="flex flex-wrap gap-4">
        <InputField label="Username" name="userName" register={register} defaultValue={data.userName} error={errors.userName} />
        <InputField label="Email" name="email" register={register} defaultValue={data.email} error={errors.email} />
        <InputField label="Pin" type="password" name="password" register={register} defaultValue={data.password} error={errors.password} />
      </div>

      <span className="text-xs text-gray-400 font-medium">Personal Information</span>
      <div className="flex flex-wrap gap-4">
        <InputField label="Full Name" name="name" register={register} defaultValue={data.name} error={errors.name} />
        <InputField label="Phone" name="phone" register={register} defaultValue={data.phone} error={errors.phone} />
        <InputField label="Role" name="role" register={register} defaultValue={data.role} error={errors.role} />
        <InputField label="Address" name="address" register={register} defaultValue={data.address} error={errors.address} />
        <InputField label="Blood Group" name="bloodGroup" register={register} defaultValue={data.bloodGroup} error={errors.bloodGroup} />
        <InputField label="NID" name="nid" register={register} defaultValue={data.nid} error={errors.nid} />
        <InputField label="Class Teacher Of" name="classTeacher" register={register} defaultValue={data.classTeacher} error={errors.classTeacher} />
        <InputField label="Subjects (comma-separated)" name="subjects" register={register} defaultValue={data.subjects} error={errors.subjects} />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Gender</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("gender")} defaultValue={data.gender || "male"}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className="text-xs text-red-400">{errors.gender.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`bg-indigo-600 text-white p-2 rounded-md font-medium flex items-center justify-center gap-2 transition ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
        }`}
      >
        {loading && <ClipLoader color="#fff" size={16} />}
        {type === "create" ? "Create Teacher" : "Update Teacher"}
      </button>
    </form>
  );
};

export default TeacherForm;