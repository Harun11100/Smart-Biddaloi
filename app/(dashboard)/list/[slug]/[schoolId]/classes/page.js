"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  IoAddCircleOutline,
  IoSchoolOutline,
  IoTrashOutline,
} from "react-icons/io5";

const availableClasses = [
  "প্লে-শ্রেণী","নার্সারি-শ্রেণী","প্রথম শ্রেণী","দ্বিতীয় শ্রেণী",
  "তৃতীয় শ্রেণী","চতুর্থ শ্রেণী","পঞ্চম শ্রেণী","ষষ্ঠ শ্রেণী",
  "সপ্তম শ্রেণী","অষ্টম শ্রেণী","নবম শ্রেণী","দশম শ্রেণী",
];

const availableSections = ["A", "B", "C"];

export default function ClassList() {
  const params = useSearchParams();
  const router = useRouter();

  const [schoolDetails, setSchoolDetails] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const STORAGE_KEY = schoolDetails
    ? `classes_${schoolDetails.schoolId}`
    : "";

  /* ---------- AUTH CHECK ---------- */
  useEffect(() => {
    const stored = localStorage.getItem("schoolDetails");
    if (!stored) return router.push("/sign-in-as-admin");

    const school = JSON.parse(stored);
    if (!school.schoolId) return router.push("/sign-in-as-admin");

    setSchoolDetails(school);
  }, [router]);

  /* ---------- FETCH ---------- */
  const fetchClasses = async () => {
    if (!schoolDetails) return;
    const res = await axios.get(
      `/api/school/class/getClass?schoolId=${schoolDetails.schoolId}`
    );
    const data = res.data.data || [];
    setClasses(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  useEffect(() => {
    if (!schoolDetails) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    stored ? setClasses(JSON.parse(stored)) : fetchClasses();
    setInitialLoad(false);
  }, [schoolDetails]);

  /* ---------- TOGGLE SECTION ---------- */
  const toggleSection = (section) => {
    setSelectedSection((prev) => (prev === section ? "" : section));
  };

  /* ---------- ADD CLASS ---------- */
  const addClass = async () => {
    if (!selectedClass) {
      return alert("Please select a class");
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/school/class/addClass", {
        schoolId: schoolDetails.schoolId,
        className: selectedClass,
        sectionName: selectedSection || undefined,
      });

      if (res.data.success) {
        setSelectedClass("");
        setSelectedSection("");
        fetchClasses();
      } else {
        alert(res.data.message);
      }
    } catch {
      alert("Failed to add class");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DELETE ---------- */
  const deleteClass = async (id) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    const prev = [...classes];
    setClasses(prev.filter((c) => c._id !== id));
    setLoadingDelete(id);

    try {
      const res = await fetch(
        `/api/school/class/deleteClass?classId=${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!data.success) setClasses(prev);
    } catch {
      setClasses(prev);
    } finally {
      setLoadingDelete(null);
    }
  };

  if (!schoolDetails) {
    return <p className="text-center p-6 text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen  from-slate-100 to-blue-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border p-6 border-gray-100 md:p-10">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-blue-900">
            Class Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Add and manage school classes
          </p>
        </div>

        {/* CLASS SELECT */}
        <Section title="Select Class">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableClasses.map((cls) => (
              <Chip
                key={cls}
                active={selectedClass === cls}
                onClick={() => setSelectedClass(cls)}
              >
                {cls}
              </Chip>
            ))}
          </div>
        </Section>

        {/* SECTION SELECT */}
        <Section
          title={
            <>
              Select Section
              {selectedSection && (
                <span className="ml-2 text-xs text-gray-500">
                  (Selected: {selectedSection})
                </span>
              )}
            </>
          }
        >
          <div className="flex flex-wrap gap-3">
            {availableSections.map((sec) => (
              <Chip
                key={sec}
                active={selectedSection === sec}
                onClick={() => toggleSection(sec)}
              >
                {selectedSection === sec ? `✓ Section ${sec}` : `Section ${sec}`}
              </Chip>
            ))}
          </div>
        </Section>

        {/* ADD BUTTON */}
        <button
          onClick={addClass}
          disabled={loading}
          className={`bg-blue-500 text-white p-2 rounded-md flex items-center justify-center gap-2 transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}

        >
          {loading ? "Adding..." : <><IoAddCircleOutline size={20}/> Add Class</>}
        </button>

        {/* LIST */}
        <h2 className="text-xl font-bold text-blue-900 text-center mt-12 mb-6">
          Added Classes
        </h2>

        {initialLoad ? (
          <p className="text-center text-gray-400 animate-pulse">Loading...</p>
        ) : classes.length === 0 ? (
          <p className="text-center text-gray-500">No classes added yet</p>
        ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {classes.map((item) => (
    <div
      key={item._id}
      className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition"
    >
      {/* HEADER ROW */}
      <div className="flex items-start justify-between gap-3">
        {/* CLASS INFO */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 shrink-0">
            <IoSchoolOutline className="text-blue-600" size={22} />
          </div>

          <p className="font-medium text-gray-800 leading-snug">
            {item.className}
            {item.sectionName && (
              <span className="text-gray-500">{" "}– {item.sectionName}</span>
            )}
          </p>
        </div>

        {/* DELETE ACTION */}
        <button
          onClick={() => deleteClass(item._id)}
          disabled={loadingDelete === item._id}
          className="p-2 rounded-lg border border-red-200 hover:bg-red-50 transition disabled:opacity-60"
        >
          {loadingDelete === item._id ? (
            <span className="text-xs text-red-500">Deleting…</span>
          ) : (
            <IoTrashOutline className="text-red-500" />
          )}
        </button>
      </div>
    </div>
  ))}
</div>


        )}
      </div>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

const Section = ({ title, children }) => (
  <div className="mb-6">
    <p className="font-semibold text-blue-900 mb-3">{title}</p>
    {children}
  </div>
);

const Chip = ({ active, children, ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-full border text-sm font-medium transition
      ${
        active
          ? "bg-blue-100 text-blue-700 border-blue-500 shadow-sm"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
      }
    `}
  >
    {children}
  </button>
);
