"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";



export default function OmrCheckPage() {


  const teacherId ="69457823f6606e419dcf9e25";

  const [answerKey, setAnswerKey] = useState("");
  const [image, setImage] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [result, setResult] = useState(null);

  const saveAnswerKey = async () => {
    if (!answerKey.trim()) return alert("Please enter correct answers");
    if (!teacherId) return alert("Teacher ID missing");

    setLoadingSave(true);
    try {
      const res = await fetch(`/api/teacher/save-answer-key`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, answerKey: answerKey.trim() }),
      });

      const data = await res.json();
      if (!data.success) return alert(data.message || "Failed to save answer key");

      alert(`Answer key saved successfully (${data.totalQuestions} questions)`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setResult(null);
  };

  const checkOmr = async () => {
    if (!image) return alert("Please upload OMR sheet image");

    setLoadingCheck(true);
    try {
      const formData = new FormData();
      formData.append("teacherId", teacherId);
      formData.append("image", image);

      const res = await fetch(`/api/omr/check`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.success) return alert(data.message || "OMR check failed");

      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to process OMR");
    } finally {
      setLoadingCheck(false);
    }
  };

  const resetForNext = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="container">
      <h1 className="header">📝 OMR Result Checking</h1>

      {/* Answer Key */}
      <div className="card">
        <label className="label">Correct Answers</label>
        <textarea
          className="input"
          placeholder="1. A, 2. B, 3. A, 4. C"
          value={answerKey}
          onChange={(e) => setAnswerKey(e.target.value)}
        />
        <button
          onClick={saveAnswerKey}
          disabled={loadingSave}
          className="btn btn-save"
        >
          {loadingSave ? "Saving..." : "Save Answer Key"}
        </button>
      </div>

      {/* Image Upload */}
      <div className="card">
        <label className="label">Upload Student OMR Sheet</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {image && <p>Selected file: {image.name}</p>}

        <button
          onClick={checkOmr}
          disabled={loadingCheck}
          className="btn btn-check"
        >
          {loadingCheck ? "Checking..." : "Check OMR"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="card resultCard">
          <p className="resultText">
            Score: {result.score} / {result.total}
          </p>
          <button onClick={resetForNext} className="btn btn-reset">
            Check Next Sheet
          </button>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          font-size: 24px;
          color: #0a47a1;
          margin-bottom: 20px;
        }
        .card {
          background: #fff;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 16px;
        }
        .label {
          font-weight: 700;
          display: block;
          margin-bottom: 6px;
        }
        .input {
          width: 100%;
          min-height: 60px;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 10px;
        }
        .btn {
          padding: 12px;
          border-radius: 8px;
          font-weight: 700;
          color: #fff;
          border: none;
          cursor: pointer;
          width: 100%;
        }
        .btn-save {
          background: linear-gradient(to right, #4d73bf, #184c9f);
        }
        .btn-check {
          background: linear-gradient(to right, #16a34a, #15803d);
          margin-top: 10px;
        }
        .btn-reset {
          background: linear-gradient(to right, #2563eb, #1e40af);
          margin-top: 10px;
        }
        .resultCard {
          background-color: #ecfdf5;
          text-align: center;
        }
        .resultText {
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 10px;
          color: #065f46;
        }
      `}</style>
    </div>
  );
}
