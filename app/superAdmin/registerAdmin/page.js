"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("নাম আবশ্যক"),
  email: Yup.string().email("সঠিক ইমেইল দিন").required("ইমেইল আবশ্যক"),
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, "ফোন নম্বর ১১ ডিজিট হতে হবে")
    .required("ফোন নম্বর আবশ্যক"),
  password: Yup.string()
    .min(6, "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে")
    .required("পাসওয়ার্ড আবশ্যক"),
  secretId: Yup.string().required("সিক্রেট আইডি আবশ্যক"),  
});

export default function AdminRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values, { resetForm }) => {
    setLoading(true);

    try {
      const res = await axios.post("/api/admin/create", values);

      if (res.data.success) {
        window.alert("Admin created successfully!");
        resetForm();
        router.push("/admin/login");
      } else {
        window.alert(res.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      window.alert(error?.response?.data?.message || "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-indigo-700 mb-6">
          এডমিন রেজিস্ট্রেশন
        </h1>

        <Formik
          initialValues={{ name: "", email: "", phone: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  নাম
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="নাম লিখুন"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border rounded bg-white"
                />
                {errors.name && touched.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  ইমেইল
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="ইমেইল লিখুন"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border rounded bg-white"
                />
                {errors.email && touched.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  ফোন নম্বর
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="ফোন নম্বর লিখুন"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border rounded bg-white"
                />
                {errors.phone && touched.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="পাসওয়ার্ড লিখুন"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border rounded bg-white"
                />
                {errors.password && touched.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>
               <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  পাসওয়ার্ড
                </label>
                <input
                  
                  name="secretId"
                  placeholder=" সিক্রেট আইডি লিখুন"
                  value={values.secretId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border rounded bg-white"
                />
                {errors.secretId && touched.secretId && (
                  <p className="text-red-600 text-sm mt-1">{errors.secretId}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded text-white font-medium ${
                  loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "প্রসেসিং..." : "রেজিস্টার করুন"}
              </button>
            </form>
          )}
        </Formik>

        {/* Navigation */}
        <p className="text-center text-sm text-gray-600 mt-4">
          ইতিমধ্যে এডমিন আছেন?{" "}
          <a href="/admin/login" className="text-indigo-600 hover:underline">
            লগইন করুন
          </a>
        </p>
      </div>
    </div>
  );
}
