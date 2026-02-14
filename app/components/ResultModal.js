"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ResultUploadForm = dynamic(() => import("./forms/ResultUploadForm"), {
  loading: () => <p className="p-6">Loading...</p>,
});

const StudentResultView = dynamic(() => import("./ResultView"), {
  loading: () => <p className="p-6">Loading...</p>,
});

const ResultModal = ({ table, schoolId, type, onSuccess, studentId, classId }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  // Optional: Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Determine which component to render
  const renderContent = () => {
    if (table !== "result") return null;

    switch (type) {
      case "create":
      case "update":
        return (
          <ResultUploadForm
            type={type}
            schoolId={schoolId}
            classId={classId}
            studentId={studentId}
            onSuccess={onSuccess}
          />
        );
      case "view":
        return (
          <StudentResultView
            type={type}
            schoolId={schoolId}
            studentId={studentId}
            onSuccess={onSuccess}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Open button */}
      <button
        aria-label={type === "view" ? "View Results" : "Add Result"}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-lamaYellow hover:scale-105 transition shadow-md"
        onClick={() => setOpen(true)}
      >
        {type === "view" ? (
          <Image src="/view.png" alt="View" width={18} height={18} />
        ) : (
          <Image src="/create.png" alt="Create" width={18} height={18} />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setOpen(false)}
            />

            {/* Modal wrapper */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            >
              {/* Modal container */}
              <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden h-[90vh] sm:h-[85vh] md:h-[90vh] lg:h-[95vh]">
                {/* Close button */}
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-4 right-4 z-50 hover:scale-110 transition"
                >
                  <Image src="/close.png" alt="Close" width={20} height={20} />
                </button>

                {/* Modal content */}
                {renderContent()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResultModal;
