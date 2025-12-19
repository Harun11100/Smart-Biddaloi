"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { BsCalendar } from "react-icons/bs";

/* ---------------- Schema ---------------- */
const schema = z.object({
  title: z.string().min(1, { message: "Subject is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  dueDate: z.string().min(1, { message: "Due date is required!" }),
});

/* ---------------- Reusable Input ---------------- */
const InputField = ({
  label,
  type = "text",
  register,
  name,
  error,
  inputProps,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs text-gray-500">{label}</label>
    <input
      type={type}
      {...register(name)}
      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
      {...inputProps}
    />
    {error?.message && (
      <p className="text-xs text-red-400">{error.message}</p>
    )}
  </div>
);

/* ---------------- Homework Form ---------------- */
const HomeworkForm = ({ type = "create", data = {}, schoolId, classId, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title || "",
      description: data.description || "",
      dueDate: data?.dueDate ? data.dueDate.slice(0, 10) : "",
    },
  });

  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        schoolId,
        classId,
      };

      let res;
      if (type === "create") {
        res = await axios.post("/api/teacher/Homework/createHomework", payload);
      } else {
        res = await axios.put(
          `/api/teacher/Homework/updateHomework/${data._id}`,
          payload
        );
      }

      if (res.data.success) {
        alert(type === "create" ? "Homework created!" : "Homework updated!");
        reset();
        onSuccess?.();
      } else {
        alert(res.data.message || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Homework" : "Update Homework"}
      </h1>

      {/* Section */}
      <span className="text-xs text-gray-400 font-medium">
        Homework Information
      </span>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="Subject"
          name="title"
          register={register}
          error={errors.title}
        />

        {/* Due Date */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Due Date</label>
          <div className="relative">
            <input
              type="date"
              {...register("dueDate")}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            />
            <BsCalendar className="absolute right-3 top-2.5 text-gray-400" />
          </div>
          {errors.dueDate && (
            <p className="text-xs text-red-400">{errors.dueDate.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Homework Details</label>
        <textarea
          {...register("description")}
          rows={4}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full resize-none"
        />
        {errors.description && (
          <p className="text-xs text-red-400">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`bg-indigo-600 text-white p-2 rounded-md font-medium flex items-center justify-center gap-2 transition ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
        }`}
      >
        {loading && <ClipLoader color="#fff" size={16} />}
        {type === "create" ? "Create Homework" : "Update Homework"}
      </button>
    </form>
  );
};

export default HomeworkForm;
