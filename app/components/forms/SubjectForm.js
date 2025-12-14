"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import InputField from "../InputField";
import ClipLoader from "react-spinners/ClipLoader";

/* =========================
   Zod Schema
========================= */
const schema = z.object({
  name: z.string().min(1, { message: "Subject name is required!" }),
  code: z
    .string()
    .min(1, { message: "Subject code is required!" })
    .toUpperCase(),
  creditHours: z.coerce.string().optional(),
  maxMarks: z.coerce.string().optional(),
  passingMarks: z.coerce.string().optional(),
});

/* =========================
   Component
========================= */
const SubjectForm = ({
  onSubmit,
  schoolId,
  data,
  type,
  loading = false,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      creditHours: "",
      maxMarks: "",
      passingMarks: "",
      ...data,
    },
  });

  const submitHandler = async (values) => {
    try {
      const payload = {
        ...values,
        schoolId,
        ...(type === "update" ? { subjectId: data?._id } : {}),
      };

      const url =
        type === "create"
          ? "/api/school/subject/createSubject"
          : "/api/school/subject/updateSubject";

      const res =
        type === "create"
          ? await axios.post(url, payload)
          : await axios.put(url, payload);

      if (res.data.success) {
        alert(
          type === "create"
            ? "Subject created successfully!"
            : "Subject updated successfully!"
        );
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
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(submitHandler)}
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create New Subject" : "Update Subject"}
      </h1>

      <span className="text-xs text-gray-400 font-medium">
        Subject Information
      </span>

      <div className="flex flex-wrap gap-4">
        <InputField
          label="Subject Name"
          name="name"
          register={register("name")}
          defaultValue={data?.name}
          error={errors.name}
        />

        <InputField
          label="Subject Code"
          name="code"
          register={register("code")}
          defaultValue={data?.code}
          error={errors.code}
        />

        <InputField
          label="Credit Hours"
          name="creditHours"
          type="number"
          register={register("creditHours")}
          defaultValue={data?.creditHours}
          error={errors.creditHours}
        />

        <InputField
          label="Max Marks"
          name="maxMarks"
          type="number"
          register={register("maxMarks")}
          defaultValue={data?.maxMarks}
          error={errors.maxMarks}
        />

        <InputField
          label="Passing Marks"
          name="passingMarks"
          type="number"
          register={register("passingMarks")}
          defaultValue={data?.passingMarks}
          error={errors.passingMarks}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`bg-indigo-600 text-white p-2 rounded-md font-medium flex items-center justify-center gap-2 transition ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
        }`}
      >
        {loading && <ClipLoader color="#fff" size={16} />}
        {type === "create" ? "Create Subject" : "Update Subject"}
      </button>
    </form>
  );
};

export default SubjectForm;
