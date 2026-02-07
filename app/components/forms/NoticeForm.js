"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs text-gray-500">{label}</label>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full h-24"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
      />
    )}
  </div>
);

const NoticeForm = ({ type = "create", data = {}, schoolId, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type === "update" && data) {
      setTitle(data.title || "");
      setDescription(data.description || "");
    }
  }, [type, data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      return alert("Error: Please enter both title and description!");
    }

    if (!schoolId) return;

    setLoading(true);

    try {
      const date = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;
      const isUpdate = type === "update";

      const url = isUpdate
        ? `/api/school/Notice/updateNotice/${data._id}`
        : `/api/school/Notice/postNotice`;

      const body = isUpdate
        ? { title, description }
        : { schoolId, title, description, date };

      const res = await axios({ method: isUpdate ? "put" : "post", url, data: body });

      if (!res.data.success) {
        return alert(res.data.message || "Operation failed!");
      }

      if (!isUpdate) {
        setTitle("");
        setDescription("");
      }

      onSuccess?.(res.data.notices || res.data.notice);
    } catch (err) {
      console.error(err);
      alert("Failed to save notice!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">
        {type === "update" ? "Update Announcement" : "Create New Announcement"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Anouncement Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter announcement title"
        />
        <InputField
          label="Description"
          type="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
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
        {type === "create" ? "Create Announcement" : "Update Announcement"}
      </button>
    </form>
  );
};

export default NoticeForm;
