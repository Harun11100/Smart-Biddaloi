"use client";

import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ResultSchema = Yup.object().shape({
  examType: Yup.string().required("Please select an exam type"),
  results: Yup.array().of(
    Yup.object().shape({
      subject: Yup.string().required(),
      mark: Yup.number()
        .typeError("Marks must be a number")
        .min(0)
        .max(100)
        .required("Enter marks"),
    })
  ),
});

export default function ResultUploadForm({ schoolId, studentId, classId }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!classId) return;
    fetchSubjects();
  }, [classId]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/school/subject/getSubject?classId=${classId}`
      );
      if (res.data?.success) {
        setSubjects(res.data.subjects || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const submitToServer = async (values, { resetForm }) => {
    try {
      setLoading(true);

      const payload = {
        examType: values.examType,
        schoolId,
        studentId,
        results: values.results.map((r) => ({
          subject: r.subject,
          mark: Number(r.mark),
          maxMarks: r.maxMarks,
          passingMarks: r.passingMarks,
        })),
      };

      const res = await axios.post(
        `/api/school/student/result/addResult`,
        payload
      );

      if (res?.data?.success) {
        alert("Result uploaded successfully");
        resetForm();
      }
    } finally {
      setLoading(false);
    }
  };

  const initialResults = subjects.map((s) => ({
    subject: s.name,
    mark: "",
    maxMarks: s.maxMarks ?? 100,
    passingMarks: s.passingMarks ?? 33,
  }));

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl flex flex-col h-[95vh]">
      <Formik
        enableReinitialize
        initialValues={{
          examType: "",
          results: initialResults,
        }}
        validationSchema={ResultSchema}
        onSubmit={submitToServer}
      >
        {({ values, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-6 py-5 gap-4 border-b bg-gradient-to-r from-blue-50 to-white rounded-t-2xl shrink-0">
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  Upload Student Result
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Enter marks for each subject
                </p>
              </div>

              <div className="w-full lg:w-1/3">
                <label className="text-sm font-medium text-gray-700">
                  Exam Type
                </label>
                <select
                  value={values.examType}
                  onChange={(e) =>
                    setFieldValue("examType", e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select exam type</option>
                  <option value="1st Term">1st Term</option>
                  <option value="2nd Term">2nd Term</option>
                  <option value="3rd Term">3rd Term</option>
                  <option value="Tutorial Exam">Tutorial Exam</option>
                  <option value="Annual Exam">Annual Exam</option>
                </select>
              </div>
            </div>

            {/* SUBJECT LIST */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Subjects & Marks
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {values.results.map((item, index) => (
                    <div
                      key={item.subject}
                      className="grid grid-cols-12 gap-3 items-center
                                 bg-gray-50 border border-gray-200 rounded-xl p-3"
                    >
                      {/* SUBJECT NAME */}
                      <input
                        value={item.subject}
                        disabled
                        className="col-span-7 rounded-lg border border-gray-200 bg-gray-100
                                   px-3 py-2 text-sm text-gray-700"
                      />

                      {/* MARK */}
                      <input
                        type="number"
                        placeholder="Marks"
                        value={item.mark}
                        onChange={(e) =>
                          setFieldValue(
                            `results[${index}].mark`,
                            e.target.value
                          )
                        }
                        className="col-span-5 rounded-lg border border-gray-300 px-3 py-2 text-sm
                                   focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t bg-white rounded-b-2xl">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-white text-sm font-semibold
                           hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload Result"}
              </button>
            </div>

          </form>
        )}
      </Formik>
    </div>
  );
}
