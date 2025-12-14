'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { IoAddCircleOutline, IoSchoolOutline, IoTrashOutline } from "react-icons/io5";

const availableClasses = [
  "Play",
  "Nursery",
  "Class One",
  "Class Two",
  "Class Three",
  "Class Four",
  "Class Five",
  "Class Six",
  "Class Seven",
  "Class Eight",
  "Class Nine",
  "Class Ten",
];

const availableSections = ["A", "B", "C"];

export default function ClassList() {
  const params = useSearchParams();
  const slug = params.get("slug") || "";
  const router = useRouter();

  const [schoolDetails, setSchoolDetails] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const STORAGE_KEY = schoolDetails ? `classes_${schoolDetails.schoolId}` : "";

  // Load school details
  useEffect(() => {
    const stored = localStorage.getItem("schoolDetails");
    if (stored) {
      const school = JSON.parse(stored);
      if (!school.schoolId) {
        router.push("/sign-in-as-admin");
        return;
      }
      setSchoolDetails(school);
    } else {
      router.push("/sign-in-as-admin");
    }
  }, [router]);

  const fetchClassesFromDb = async () => {
    if (!schoolDetails) return;
    try {
      const res = await axios.get(`/api/school/class/getClass?schoolId=${schoolDetails.schoolId}`);
      const fetched = res.data.data || [];
      setClasses(fetched);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fetched));
    } catch (err) {
      console.error("Error fetching classes:", err);
      alert("Failed to fetch classes.");
    }
  };

  const loadClassesFromStorage = () => {
    if (!STORAGE_KEY) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setClasses(JSON.parse(stored));
    } else {
      fetchClassesFromDb();
    }
    setInitialLoad(false);
  };

  useEffect(() => {
    if (schoolDetails) loadClassesFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolDetails]);

  const addClass = async () => {
    if (!selectedClass) return alert("Please select a class");
    if (!schoolDetails) return;

    setLoading(true);
    try {
      const res = await axios.post(`/api/school/class/addClass`, {
        schoolId: schoolDetails.schoolId,
        className: selectedClass,
        sectionName: selectedSection,
      });

      if (res.data.success) {
        setSelectedClass("");
        setSelectedSection("");
        await fetchClassesFromDb();
        alert("Class added successfully!");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add class");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) deleteClass(id);
  };

  const deleteClass = async (classId) => {
    if (!schoolDetails) return;

    const prev = [...classes];
    const updated = prev.filter((n) => n._id !== classId);

    setClasses(updated);
    setLoadingDelete(classId);

    try {
      const res = await fetch(`/api/school/class/deleteClass?classId=${classId}`, { method: "DELETE" });
      const data = await res.json();

      if (!data.success) {
        setClasses(prev);
        alert("Failed to delete.");
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (err) {
      console.error(err);
      setClasses(prev);
      alert("Failed to delete.");
    } finally {
      setLoadingDelete(null);
    }
  };

  if (!schoolDetails) {
    return <p className="p-4 text-center text-gray-500">Loading school details...</p>;
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen pb-40">
      <h1 className="text-center text-2xl md:text-3xl font-extrabold text-blue-800 tracking-wide mb-8">
        Class Management
      </h1>

      {/* CLASS SELECT */}
      <p className="font-semibold text-blue-900 mb-2">Select Class</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {availableClasses.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedClass(c)}
            className={`px-3 py-2 rounded-lg border text-sm transition-all ${
              selectedClass === c ? "border-blue-600 text-blue-700" : "border-gray-300 text-gray-700"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="font-semibold text-blue-900 mb-2">Select Section</p>
      <div className="flex flex-wrap gap-3 mb-6">
        {availableSections.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedSection(s)}
            className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
              selectedSection === s ? "border-blue-600 text-blue-700" : "border-gray-300 text-gray-800"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={addClass}
        disabled={loading}
        className="w-full py-2 rounded-xl border text-blue-700 font-semibold text-sm flex justify-center items-center gap-2 hover:bg-blue-50 transition-all"
      >
        {loading ? "Adding..." : <><IoAddCircleOutline size={20} /> Add Class</>}
      </button>

      {/* CLASS LIST */}
      <h1 className="text-center text-xl md:text-2xl font-bold text-blue-900 mt-10 mb-5">
        Class List
      </h1>

      {initialLoad ? (
        <p className="text-center text-gray-600 animate-pulse">Loading...</p>
      ) : classes.length === 0 ? (
        <p className="text-center text-gray-500">No classes added yet.</p>
      ) : (
        <div className="space-y-4">
          {classes.map((item) => (
            <div
              key={item._id}
              className="bg-white/70 p-4 rounded-xl shadow flex justify-between items-center border"
            >
              <div className="flex items-center gap-3">
                <IoSchoolOutline size={22} className="text-blue-700" />
                <p className="font-semibold text-gray-800 text-sm">
                  {item.className}
                  {item.sectionName && ` - ${item.sectionName}`}
                </p>
              </div>

              <button
                onClick={() => handleDelete(item._id)}
                disabled={loadingDelete === item._id}
                className="p-2 rounded-lg border border-red-300 hover:bg-red-50 transition-all"
              >
                {loadingDelete === item._id ? (
                  <span className="text-red-600 text-xs">Deleting...</span>
                ) : (
                  <IoTrashOutline size={18} className="text-red-500" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
