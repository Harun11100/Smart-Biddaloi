
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ResultSchema = Yup.object().shape({
  examType: Yup.string().required("Please select an exam type"),
  results: Yup.array()
    .of(
      Yup.object().shape({
        subject: Yup.string().required("Please select a subject"),
        mark: Yup.number()
          .typeError("Marks must be a number")
          .min(0, "Marks cannot be less than 0")
          .max(100, "Marks cannot exceed 100")
          .required("Enter marks"),
      })
    )
    .min(1, "Add at least one subject"),
});

const EMPTY_RESULT = { subject: "", mark: "", maxMarks: 100, passingMarks: 33 };

export default function ResultUploadPage() {
   const params = useParams();
  const { slug, schoolId, id: studentId } = params; // id from your route is studentId

  console.log("schoolId:", schoolId, "studentId:", studentId);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("Subjects:", subjects);
  console.log(schoolId, studentId)
  useEffect(() => {
    if (!schoolId) return;
    fetchSubjects();
  }, [schoolId]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/school/subject/getSubject?schoolId=${schoolId}`);
      if (res.data?.success) setSubjects(res.data.subjects || []);
      else alert("Unable to load subjects");
    } catch (err) {
      console.error(err);
      alert("Network error");
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
        results: values.results.map(r => ({
          subject: r.subject,
          mark: Number(r.mark),
          maxMarks: r.maxMarks,
          passingMarks: r.passingMarks,
        })),
      };

      const res = await axios.post(`/api/school/student/result/addResult`, payload);

      if (res?.data?.success) {
        alert("Result uploaded successfully");
        resetForm();
      } else alert(res?.data?.message || "Upload failed");
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Upload Student Result</h1>

        <Formik
          initialValues={{ examType: "", results: [EMPTY_RESULT] }}
          validationSchema={ResultSchema}
          onSubmit={submitToServer}
        >
          {({ values, errors, touched, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Exam Type */}
              <div className="space-y-1">
                <label className="block font-medium">🧾 Exam Type</label>
                <select
                  value={values.examType}
                  onChange={(e) => setFieldValue("examType", e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select exam type</option>
                  <option value="1st Term">1st Term</option>
                  <option value="2nd Term">2nd Term</option>
                  <option value="3rd Term">3rd Term</option>
                  <option value="Tutorial Exam">Tutorial Exam</option>
                  <option value="Annual Exam">Annual Exam</option>
                </select>
                {touched.examType && errors.examType && (
                  <p className="text-red-500 text-sm">{errors.examType}</p>
                )}
              </div>

              {/* Subjects */}
              <FieldArray name="results">
                {({ push, remove }) => (
                  <div className="space-y-2">
                    <label className="block font-medium">📚 Subjects & Marks</label>

                    {values.results.map((item, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <select
                          value={item.subject}
                          onChange={(e) => {
                            const selected = subjects.find(s => s.name === e.target.value);
                            setFieldValue(`results[${index}].subject`, e.target.value);
                            setFieldValue(`results[${index}].mark`, "");
                            setFieldValue(`results[${index}].maxMarks`, selected?.maxMarks ?? 100);
                            setFieldValue(`results[${index}].passingMarks`, selected?.passingMarks ?? 33);
                          }}
                          className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select subject</option>
                          {subjects.map((s) => (
                            <option key={s._id} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          placeholder="Marks"
                          value={item.mark}
                          onChange={(e) => setFieldValue(`results[${index}].mark`, e.target.value)}
                          className="w-24 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            values.results.length === 1
                              ? setFieldValue(`results[0]`, EMPTY_RESULT)
                              : remove(index)
                          }
                          className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => push(EMPTY_RESULT)}
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                      + Add Subject
                    </button>

                    {typeof errors.results === "string" && (
                      <p className="text-red-500 text-sm">{errors.results}</p>
                    )}
                  </div>
                )}
              </FieldArray>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload Result"}
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
