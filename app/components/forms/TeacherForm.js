"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import ClipLoader from "react-spinners/ClipLoader";
import { useState } from "react";
import { uploadImages } from "@/app/request/ImageUploads";
import axios from "axios";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  userName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z.string().min(4, { message: "Pin must be at least 4 characters!" }).optional(),
  gender: z.enum(["male", "female"]).optional(),
  phone: z.string().min(1, { message: "Phone is required!" }),
  role: z.string().min(1, { message: "Role is required!" }),
  address: z.string().optional(),
  bloodGroup: z.string().optional(),
  nid: z.string().optional(),
  classTeacher: z.string().optional(),
  subjects: z.string().optional(),
  imageUrl: z.string().optional(),
  experience: z.string().optional(),
});

const TeacherForm = ({ type, data = {}, loading = false, schoolId, onSuccess }) => {
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(data.imageUrl || "");

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const [uploadedImage] = await uploadImages([file]);
      setImageUrl(uploadedImage.url);
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  const submitHandler = async (values) => {
    try {
      const payload = {
        ...values,
        imageUrl,
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

      console.log("Submitting payload:", payload);
      // API call here
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col gap-4 bg-white rounded-xl max-w-7xl mx-auto"
    >
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        {type === "create" ? "Create a New Teacher" : "Update Teacher"}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Teacher Photo */}
        <div className="flex flex-col gap-2 md:w-1/5">
          <label className="text-sm font-medium text-gray-600">Teacher Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border border-gray-300 rounded-md p-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {imageUploading && <p className="text-xs text-gray-400">Uploading...</p>}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Teacher"
              className="w-24 h-24 object-cover rounded-md border border-gray-200 shadow-sm"
            />
          )}
        </div>

        {/* Form Fields */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Authentication */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-500">Authentication Information</span>
            <div className="flex flex-wrap gap-3">
              <InputField label="Username" name="userName" register={register} defaultValue={data.userName} error={errors.userName} />
              <InputField label="Email" name="email" register={register} defaultValue={data.email} error={errors.email} />

              {/* Only show Pin field when creating */}
              {type === "create" && (
                <InputField label="Pin" type="password" name="password" register={register} defaultValue={data.password} error={errors.password} />
              )}
            </div>
          </div>

          {/* Personal Info */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-500">Personal Information</span>
            <div className="flex flex-wrap gap-3">
              <InputField label="Full Name" name="name" register={register} defaultValue={data.name} error={errors.name} />
              <InputField label="Phone" name="phone" register={register} defaultValue={data.phone} error={errors.phone} />
              <InputField label="Experience" name="experience" register={register} defaultValue={data.experience} error={errors.experience} />
              <InputField label="Role" name="role" register={register} defaultValue={data.role} error={errors.role} />
              <InputField label="Address" name="address" register={register} defaultValue={data.address} error={errors.address} />
              <InputField label="Blood Group" name="bloodGroup" register={register} defaultValue={data.bloodGroup} error={errors.bloodGroup} />
              <InputField label="NID" name="nid" register={register} defaultValue={data.nid} error={errors.nid} />
              <InputField label="Class Teacher Of" name="classTeacher" register={register} defaultValue={data.classTeacher} error={errors.classTeacher} />
              <InputField label="Subjects" name="subjects" register={register} defaultValue={data.subjects} error={errors.subjects} />

              <div className="flex flex-col gap-1 w-full md:w-1/6">
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <select
                  className="border border-gray-300 rounded-md p-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full"
                  {...register("gender")}
                  defaultValue={data.gender || "male"}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`bg-indigo-600 text-white py-2.5 rounded-md font-semibold flex items-center justify-center gap-2 transition ${
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
