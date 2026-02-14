"use client";

import { useState } from "react";
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
          .min(0)
          .max(100)
          .required("Enter marks"),
      })
    )
    .min(1, "Add at least one subject"),
});

const EMPTY_RESULT = {
  subject: "",
  mark: "",
  maxMarks: 100,
  passingMarks: 33,
};

export default function ResultForm({ schoolId, studentId, subjects }) {

  console.log("ResultForm props:", { schoolId, studentId, subjects })    
  const [loading, setLoading] = useState(false);

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
        "/api/school/student/result/addResult",
        payload
      );

      if (res.data?.success) {
        alert("Result uploaded successfully");
        resetForm();
      } else {
        alert(res.data?.message || "Upload failed");
      }
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
              <div>
                <label className="font-medium">🧾 Exam Type</label>
                <select
                  value={values.examType}
                  onChange={(e) =>
                    setFieldValue("examType", e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
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
                    <label className="font-medium">📚 Subjects</label>

                    {values.results.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <select
                          value={item.subject}
                          onChange={(e) => {
                            const selected = subjects.find(
                              (s) => s.name === e.target.value
                            );
                            setFieldValue(
                              `results[${index}].subject`,
                              e.target.value
                            );
                            setFieldValue(
                              `results[${index}].mark`,
                              ""
                            );
                            setFieldValue(
                              `results[${index}].maxMarks`,
                              selected?.maxMarks ?? 100
                            );
                            setFieldValue(
                              `results[${index}].passingMarks`,
                              selected?.passingMarks ?? 33
                            );
                          }}
                          className="flex-1 p-2 border rounded-md"
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
                          onChange={(e) =>
                            setFieldValue(
                              `results[${index}].mark`,
                              e.target.value
                            )
                          }
                          className="w-24 p-2 border rounded-md"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            values.results.length === 1
                              ? setFieldValue("results", [EMPTY_RESULT])
                              : remove(index)
                          }
                          className="px-2 bg-red-500 text-white rounded-md"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => push(EMPTY_RESULT)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      + Add Subject
                    </button>
                  </div>
                )}
              </FieldArray>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 text-white rounded-md"
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
