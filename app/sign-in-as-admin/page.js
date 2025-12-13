"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Image from "next/image";



const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
    .required("Phone number is required"),
  password: Yup.string().required("Password is required"),
});

export default function OwnerLoginPage() {
  const router = useRouter();

  const [checkingStorage, setCheckingStorage] = useState(true);
  const [loading, setLoading] = useState(false);

  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [schoolData, setSchoolData] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Auto login
  useEffect(() => {
    const stored = localStorage.getItem("schoolDetails");
    if (stored) {
      const school = JSON.parse(stored);
      router.push(`/admin/${school.slug}`);
      return;
    }
    setCheckingStorage(false);
  }, []);

  const onFormSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/school/login`, {
        phone: values.phone,
        password: values.password,
      });

      setSchoolData(res.data.school);
      setOtpModal(true);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyLoginOtp = async () => {
    if (!otp.trim()) return alert("Please enter the OTP code.");
    setVerifying(true);

    try {
      const res = await axios.post(`/api/school/verifyLoginOtp`, {
        schoolId: schoolData.schoolId,
        loginOTP: otp,
      });

      if (res.data.success) {
        localStorage.setItem("auth_token", res.data.token);
        localStorage.setItem("schoolDetails", JSON.stringify(schoolData));

        router.push(`/admin/${schoolData.slug}`);
      } else {
        alert("Invalid OTP! Try again.");
      }
    } catch (err) {
      alert("Verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  if (checkingStorage)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">

      {/* OTP Modal */}
      {otpModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white p-8 rounded-xl shadow-xl w-[330px] text-center">
            <h2 className="text-lg font-semibold mb-3">OTP Verification</h2>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-3 border rounded-lg w-full text-center text-lg tracking-widest"
              placeholder="Enter 6-digit OTP"
            />

            <button
              onClick={verifyLoginOtp}
              disabled={verifying}
              className={`w-full mt-4 py-2 rounded-lg text-white font-semibold transition 
                ${verifying ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {verifying ? "Verifying..." : "Verify"}
            </button>

            <button
              onClick={() => setOtpModal(false)}
              className="mt-3 text-red-500 font-semibold hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="bg-white p-10 rounded-xl shadow-2xl flex flex-col gap-5 w-[380px]">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Image src="/logo.png" alt="" width={28} height={28} />
          Smart Biddaloi
        </h1>

        <h2 className="text-gray-500 text-sm">Sign in to your account</h2>

        <Formik
          initialValues={{ phone: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={onFormSubmit}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            touched,
            errors,
            handleBlur,
          }) => (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Phone */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Phone Number</label>
                <input
                  name="phone"
                  type="text"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Enter phone number"
                />
                {errors.phone && touched.phone && (
                  <p className="text-xs text-red-400">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Password</label>
                <input
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
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
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm p-3 transition"
              >
                {loading ? "Loading..." : "Sign In"}
              </button>

              {/* Forgot password */}
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
