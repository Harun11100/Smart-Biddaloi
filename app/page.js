"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdSchool, MdAdminPanelSettings } from "react-icons/md";
import { motion } from "framer-motion";

export default function AccountsPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#eef4ff] to-[#ffffff] overflow-hidden p-4">

      {/* Background floating shapes */}
      <div className="absolute w-72 h-72 bg-[#dbe7ff] rounded-full blur-3xl opacity-40 top-10 left-[-80px]" />
      <div className="absolute w-72 h-72 bg-[#ffe4f3] rounded-full blur-3xl opacity-40 bottom-10 right-[-80px]" />

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="z-10 w-full max-w-md bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-8 border border-white"
      >

        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#E8F4FF] to-white shadow-md flex items-center justify-center"
        >
          <Image src="/smartbiddaloy_nobg.png" alt="Logo" width={120} height={120} />
        </motion.div>

        {/* Text */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Welcome to Smart Biddaloy
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Choose a login option
        </p>

        {/* Teacher Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/sign-in-as-teacher")}
          className="flex items-center justify-center gap-2 w-full py-3 mb-4 rounded-xl text-white font-medium
          bg-gradient-to-r from-[#4CA8FF] to-[#175FCC] shadow-md hover:shadow-lg hover:opacity-90 transition-all"
        >
          <MdSchool size={26} />
          Teacher Login
        </motion.button>

        {/* Admin Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/sign-in-as-admin")}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-medium
          bg-gradient-to-r from-[#31D387] to-[#1E7A4F] shadow-md hover:shadow-lg hover:opacity-90 transition-all"
        >
          <MdAdminPanelSettings size={26} />
          Admin Login
        </motion.button>

        {/* Future Options */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Parent & Student login will be available soon.</p>
        </div>

      </motion.div>

      {/* Footer */}
      <p className="text-gray-400 text-xs mt-6">© 2025 All rights reserved.</p>
    </div>
  );
}
