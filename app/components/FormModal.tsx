'use client';

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

interface FormModalProps {
  schoolId: string;
  onSuccess?: () => void;
  table: "teacher" | "student" | "class" | "subject";
}

const FormModal = ({ table, schoolId, onSuccess }: FormModalProps) => {
  const [open, setOpen] = useState(false);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [open]);

  return (
    <>
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full bg-lamaYellow hover:scale-105 transition-transform shadow-md"
        onClick={() => setOpen(true)}
      >
        <Image src="/create.png" alt="Create" width={18} height={18} />
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
                <div
                  className="absolute top-4 right-4 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => setOpen(false)}
                >
                  <Image src="/close.png" alt="Close" width={16} height={16} />
                </div>

                {table === "teacher" && (
                  <TeacherForm type="create" schoolId={schoolId} onSubmit={onSuccess} />
                )}
                {table === "student" && (
                  <StudentForm type="create" schoolId={schoolId} onSubmit={onSuccess} />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FormModal;
