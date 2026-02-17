"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Enter Correct Email ").required("Email is required"),
  password: Yup.string()
    .min(6, "Please Enter Your Correct Password")
    .required("Password is required"),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 🌟 OTP Modal State
  const [showOTP, setShowOTP] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/admin/login", values);

      if (res.data.success) {
        setAdminId(res.data.admin.adminId);
        setShowOTP(true); // 🌟 Show OTP modal
      } else {
        window.alert(res.data.message || "লগইন ব্যর্থ হয়েছে");
      }
    } catch (err) {
      window.alert(err?.response?.data?.message || "সার্ভার ত্রুটি!");
    } finally {
      setLoading(false);
    }
  };

  // 🌟 OTP Submit Handler
  const verifyOTP = async () => {
    if (!otp) return alert("OTP দিন");

    setOtpLoading(true);
    try {
      const res = await axios.post("/api/admin/verifyLoginOTP", {
        adminId,
        loginOTP: otp,
      });

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        router.push(`/superAdmin/${adminId}/dashboard`);
      } else {
        alert(res.data.message || "OTP ভুল হয়েছে");
      }
    } catch (error) {
      alert(error?.response?.data?.message || "OTP যাচাই ব্যর্থ!");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <>
      {/* ---------------- LOGIN UI ---------------- */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-100">
          <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            Admin Login
          </h1>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your Email"
                    className="w-full px-3 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none"
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your Password"
                    className="w-full px-3 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none"
                  />
                  {errors.password && touched.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg text-white text-lg font-semibold transition-all ${
                    loading
                      ? "bg-gray-400"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                  }`}
                >
                  {loading ? "Logging in ...." : "Login"}
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>

      {/* ---------------- OTP MODAL ---------------- */}
      {showOTP && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-sm shadow-xl p-6 rounded-xl animate-fadeIn">
            <h2 className="text-xl font-bold text-center text-indigo-700 mb-3">
              Check OTP 
            </h2>

            <p className="text-center text-gray-600 mb-4">
              Enter 6 digit OTP. Check Your Email
            </p>

            <input
              type="text"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center text-xl tracking-widest px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 mb-4"
              placeholder="______"
            />

            <button
              onClick={verifyOTP}
              disabled={otpLoading}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                otpLoading
                  ? "bg-gray-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {otpLoading ? "Verifing..." : "Verify"}
            </button>

            <button
              onClick={() => setShowOTP(false)}
              className="w-full mt-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
