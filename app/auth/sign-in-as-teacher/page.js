"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
    .required("Phone number is required"),
  password: Yup.string().required("Password is required"),
});

export default function TeacherLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState(null);

  // Check existing login
  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacherInfo");
    if (storedTeacher) {
      const { phone, schoolId } = JSON.parse(storedTeacher);
      if (phone && schoolId) {
        router.replace(`/teacher`);
      } else {
        localStorage.removeItem("teacherInfo");
      }
    }
  }, [router]);

  const saveLoginData = (teacher) => {
    localStorage.setItem("teacherInfo", JSON.stringify(teacher));
  };

  const onFormSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        phone: values.phone.trim(),
        password: values.password.trim(),
      };

      const res = await axios.post(`${API_URL}/api/teacher/login`, payload);
      const teacher = res.data?.teacher || res.data?.data?.teacher;

      if (!teacher) throw new Error("Invalid response");

      setTeacherInfo(teacher);
      setOtpModal(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyLoginOtp = async () => {
    if (!otp.trim()) {
      alert("Please enter the OTP code.");
      return;
    }

    setVerifying(true);
    try {
      const response = await axios.post(`${API_URL}/api/teacher/verifyLoginOtp`, {
        schoolId: teacherInfo.schoolId,
        teacherId: teacherInfo._id,
        loginOTP: otp,
      });

      if (response.data.success) {
        saveLoginData(teacherInfo);
        router.replace(`/teacher`);
        setOtpModal(false);
      } else {
        alert("Incorrect code. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to verify the code.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#F4F8FF]">
      {/* OTP Modal */}
      {otpModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-[330px] text-center">
            <h2 className="text-lg font-bold mb-3">OTP Verification</h2>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-3 border rounded-md w-full text-center text-lg tracking-widest"
              placeholder="Enter 6-digit code"
            />
            <button
              onClick={verifyLoginOtp}
              disabled={verifying}
              className={`w-full mt-4 py-2 rounded-md text-white font-semibold ${
                verifying ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {verifying ? "Verifying..." : "Verify"}
            </button>
            <button
              onClick={() => setOtpModal(false)}
              className="mt-2 text-red-500 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="bg-white p-12 rounded-xl shadow-2xl flex flex-col gap-4 w-[380px]">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Image src="/Schoolicon.png" alt="" width={24} height={24} />
          Smart Biddaloi
        </h1>
        <h2 className="text-gray-400 text-sm">Login to your account</h2>

        <Formik
          initialValues={{ phone: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={onFormSubmit}
        >
          {({ handleSubmit, handleChange, values, touched, errors, handleBlur }) => (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Phone */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Phone Number</label>
                <input
                  name="phone"
                  type="text"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="p-2 rounded-md ring-1 ring-gray-300"
                  placeholder="Enter phone number"
                />
                {errors.phone && touched.phone && (
                  <p className="text-xs text-red-400">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Password</label>
                <input
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="p-2 rounded-md ring-1 ring-gray-300"
                  placeholder="Enter password"
                />
                {errors.password && touched.password && (
                  <p className="text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white my-1 rounded-md text-sm p-[10px] hover:bg-blue-700 transition"
              >
                {loading ? "Loading..." : "Sign In"}
              </button>

              {/* Forgot Password */}
              <p
                onClick={() => router.push("/ResetPasswordForm")}
                className="text-xs text-blue-600 hover:underline cursor-pointer text-center"
              >
                Forgot password? Reset here
              </p>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
