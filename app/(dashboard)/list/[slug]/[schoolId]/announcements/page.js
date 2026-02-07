"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";
import { useRouter } from "next/navigation";
import FormModal from "@/app/components/FormModal";

const NoticePage = () => {
  const router = useRouter();
  const [notices, setNotices] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [schoolDetails, setSchoolDetails] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("schoolDetails");
    if (!stored) return router.push("/sign-in-as-admin");

    const school = JSON.parse(stored);
    if (!school.schoolId) return router.push("/sign-in-as-admin");

    setSchoolDetails(school);
  }, [router]);

  const schoolId = schoolDetails?.schoolId;

  // Fetch notices
  const fetchNotices = async () => {
    if (!schoolId) return;
    try {
      const res = await axios.get(`/api/school/Notice/getNotice?schoolId=${schoolId}`);
      if (res.data.success) setNotices(res.data.notices);
    } catch (err) {
      console.error("Error fetching notices:", err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [schoolId]);

  const handleDelete = async (id) => {
    setLoadingDelete(id);
    const backup = [...notices];
    setNotices(notices.filter((n) => n._id !== id));

    try {
      const res = await axios.delete(`/api/school/Notice/deleteNotice/${id}`);
      if (!res.data.success) {
        setNotices(backup);
        alert(res.data.message || "Notice could not be deleted!");
      }
    } catch (err) {
      console.error(err);
      setNotices(backup);
    } finally {
      setLoadingDelete(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">All Announcements</h1>
          <div className="flex items-center">
            <span className="text-gray-600 mr-4 font-semibold">
            Add New Announcement
            </span>
            <FormModal
            schoolId={schoolId}
            table="notice"
            type="create"
            onSuccess={fetchNotices}
          />
       
          </div>
        
      </div>

      {/* Notices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notices.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">No notices found.</p>
        ) : (
          notices.map((notice) => (
            <div
              key={notice._id}
              className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{notice.title}</h2>
                <p className="text-gray-600 mt-2">{notice.description}</p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-gray-400 text-sm">📅 {notice.date}</p>
                <div className="flex items-center space-x-2">
                  <FormModal
                    schoolId={schoolId}
                    table="notice"
                    type="update"
                    data={notice}
                    triggerClassName="text-blue-600 hover:text-blue-800"
                  />
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(notice._id)}
                  >
                    {loadingDelete === notice._id ? "..." : <AiOutlineDelete size={20} />}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoticePage;
