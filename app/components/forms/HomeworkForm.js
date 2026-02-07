"use client";

import { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { BsCalendar } from "react-icons/bs";
import { FiBookOpen } from "react-icons/fi";

const homeworkSchema = Yup.object().shape({
  title: Yup.string().required("Subject is required"),
  description: Yup.string().required("Details are required"),
  dueDate: Yup.date().required("Due date is required"),
});

export default function HomeworkUploadForm({ schoolId, classId, data, type }) {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    title: data?.title || "",
    description: data?.description || "",
    dueDate: data?.dueDate ? data.dueDate.slice(0, 10) : "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const payload = { ...values, schoolId, classId };

      const res =
        type === "update"
          ? await axios.put(
              `/api/teacher/Homework/updateHomework/${data._id}`,
              payload
            )
          : await axios.post(
              `/api/teacher/Homework/createHomework`,
              payload
            );

      if (res.data.success) {
        alert(
          `Homework ${
            type === "update" ? "updated" : "created"
          } successfully`
        );
        if (type !== "update") resetForm();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save homework");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
            <FiBookOpen size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {type === "update" ? "Update Homework" : "Create Homework"}
            </h1>
            <p className="text-sm text-gray-500">
              Fill in the homework details below
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Formik
          initialValues={initialValues}
          validationSchema={homeworkSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, values }) => (
            <Form className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">

              {/* Subject */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name
                </label>
                <Field
                  name="title"
                  placeholder="e.g. Mathematics"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="title"
                  component="p"
                  className="text-xs text-red-500 mt-1"
                />
              </div>
                 <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={values.dueDate}
                    onChange={(e) =>
                      setFieldValue("dueDate", e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <BsCalendar className="absolute right-3 top-3.5 text-gray-400" />
                </div>
                <ErrorMessage
                  name="dueDate"
                  component="p"
                  className="text-xs text-red-500 mt-1"
                />
              </div>
                </div>


              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Homework Details
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows={4}
                  placeholder="Write the homework instructions clearly..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className="text-xs text-red-500 mt-1"
                />
              </div>

              {/* Due Date */}
           

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
                  loading
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
                }`}
              >
                {loading
                  ? type === "update"
                    ? "Updating..."
                    : "Saving..."
                  : type === "update"
                  ? "Update Homework"
                  : "Save Homework"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
