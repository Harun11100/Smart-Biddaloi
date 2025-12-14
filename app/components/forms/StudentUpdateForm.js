"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import CustomInput from "../CustomInput";

// ✅ Validation Schema
const studentSchema = Yup.object({
  name: Yup.string().required("Student name is required"),
  roll: Yup.number()
    .typeError("Roll must be a number")
    .required("Roll number is required"),
  classId: Yup.string().required("Please select a class"),
  gender: Yup.string().required("Please select a gender"),
  guardianPhone: Yup.string()
    .matches(/^(01)[0-9]{9}$/, "Enter a valid mobile number")
    .required("Guardian's mobile number is required"),
  tuitionFee: Yup.number()
    .typeError("Tuition fee must be a number")
    .required("Tuition fee is required"),
  coachingFee: Yup.number()
    .typeError("Coaching fee must be a number")
    .required("Coaching fee is required"),
  address: Yup.string().required("Address is required"),
});

export default function EditStudentDetailsPage({ studentData, schoolId, studentId }) {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`/api/school/class/getClass?schoolId=${schoolId}`);
        setClasses(res.data.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch class list.");
      }
    };
    fetchClasses();
  }, [schoolId]);

  if (!studentData)
    return <p className="text-red-500 text-center mt-10">Student data not found.</p>;

  const formik = useFormik({
    initialValues: {
      name: studentData.name || "",
      roll: studentData.roll?.toString() || "",
      classId: studentData.classId || "",
      className: studentData.className || "",
      section: studentData.section || "",
      gender: studentData.gender || "",
      guardianPhone: studentData.guardianPhone || "",
      tuitionFee: studentData.tuitionFee?.toString() || "",
      coachingFee: studentData.coachingFee?.toString() || "",
      address: studentData.address || "",
    },
    validationSchema: studentSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const payload = {
          ...values,
          roll: Number(values.roll),
          tuitionFee: Number(values.tuitionFee),
          coachingFee: Number(values.coachingFee),
        };
        const res = await axios.put(`/api/school/student/updateStudent/${studentId}`, payload);
        if (res.data.success) {
          alert("✅ Student information updated successfully!");
          router.back();
        } else {
          alert(res.data.message || "Update failed.");
        }
      } catch (err) {
        console.error(err);
        alert("Server connection failed.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto rounded-md mt-10">
      <h1 className="text-xl font-bold mb-6 text-blue-700 text-center">
        Edit Student Details
      </h1>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <CustomInput
            label="Student Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name ? formik.errors.name : undefined}
          />

          <CustomInput
            label="Roll Number"
            type="number"
            name="roll"
            value={formik.values.roll}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.roll ? formik.errors.roll : undefined}
          />

          <div className="flex flex-col gap-1 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Class</label>
            <select
              name="classId"
              value={formik.values.classId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 text-sm rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className} {cls.sectionName ? `(${cls.sectionName})` : ""}
                </option>
              ))}
            </select>
            {formik.touched.classId && formik.errors.classId && (
              <p className="text-xs text-red-500">{formik.errors.classId}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Gender</label>
            <select
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 text-sm rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <p className="text-xs text-red-500">{formik.errors.gender}</p>
            )}
          </div>

          <CustomInput
            label="Guardian's Mobile Number"
            name="guardianPhone"
            value={formik.values.guardianPhone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.guardianPhone ? formik.errors.guardianPhone : undefined}
          />

          <CustomInput
            label="Tuition Fee (৳)"
            type="number"
            name="tuitionFee"
            value={formik.values.tuitionFee}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.tuitionFee ? formik.errors.tuitionFee : undefined}
          />

          <CustomInput
            label="Coaching Fee (৳)"
            type="number"
            name="coachingFee"
            value={formik.values.coachingFee}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.coachingFee ? formik.errors.coachingFee : undefined}
          />

          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs text-gray-500">Address</label>
            <textarea
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 text-sm rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 h-20 resize-none"
            />
            {formik.touched.address && formik.errors.address && (
              <p className="text-xs text-red-500">{formik.errors.address}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`bg-indigo-600 text-white p-3 rounded-md font-medium flex items-center justify-center gap-2 mt-4 transition ${
            submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
          }`}
        >
          {submitting && <ClipLoader color="#fff" size={16} />}
          Update Student
        </button>
      </form>
    </div>
  );
}
