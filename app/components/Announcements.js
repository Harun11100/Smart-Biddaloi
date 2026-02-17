"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import Image from "next/image";

const Announcements = ({ schoolId }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, onChange] = useState(new Date());
  // Optional: colors for cards
  const colors = ["bg-lamaSkyLight", "bg-lamaPurpleLight", "bg-lamaYellowLight"];

  useEffect(() => {
    if (!schoolId) return;

    const fetchNotices = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("auth_token");
        const res = await axios.get(`/api/school/Notice/getNotice?schoolId=${schoolId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setNotices(res.data.notices || []);
        } else {
          setError("Failed to fetch notices");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [schoolId]);

  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />
      
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Notice</h1>
        <span className="text-xs text-gray-400 cursor-pointer">View All</span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : notices.length === 0 ? (
          <p className="text-gray-400 text-sm">No announcements available</p>
        ) : (
          notices.map((notice, index) => (
            <div
              key={index}
              className={`${colors[index % colors.length]} rounded-md p-4`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{notice.title}</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                  {notice.date}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{notice.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
