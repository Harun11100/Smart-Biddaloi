"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  phone: Yup.string(),
});

export default function CreateAdminPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/admin/create", values);
      if (response.data.success) {
        alert("Admin created successfully!");
        resetForm();
        router.push("/admin"); // redirect to admin list page
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create Admin</h2>
      <Formik
        initialValues={{ name: "", email: "", password: "", phone: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Name</label>
            <Field name="name" className="w-full border px-3 py-2 rounded" />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Email</label>
            <Field name="email" type="email" className="w-full border px-3 py-2 rounded" />
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Password</label>
            <Field name="password" type="password" className="w-full border px-3 py-2 rounded" />
            <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Phone (optional)</label>
            <Field name="phone" className="w-full border px-3 py-2 rounded" />
            <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </Form>
      </Formik>
    </div>
  );
}
