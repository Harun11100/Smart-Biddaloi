"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const StudentUpdateForm = dynamic(
  () => import("./forms/StudentUpdateForm"),
  { loading: () => <p>Loading...</p> }
);

const FormUpdateModal = ({ schoolId, studentId, data, onSuccess }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full bg-lamaYellow hover:scale-105 transition shadow-md"
        onClick={() => setOpen(true)}
      >
        <Image src="/create.png" alt="Open" width={18} height={18} />
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

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-4 right-4 hover:scale-110 transition"
                >
                  <Image src="/close.png" alt="Close" width={16} height={16} />
                </button>

                {data && (
                  <StudentUpdateForm
                    schoolId={schoolId}
                    studentId={studentId}
                    studentData={data}
                    onSuccess={() => {
                      setOpen(false);
                      onSuccess?.();
                    }}
                  />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FormUpdateModal;
