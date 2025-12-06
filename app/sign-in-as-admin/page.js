"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "Yup";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, "ফোন নম্বর অবশ্যই ১১ ডিজিট হতে হবে")
    .required("ফোন নম্বর অবশ্যক"),
  password: Yup.string().required("পাসওয়ার্ড অবশ্যক"),
});

export default function OwnerLoginPage() {
  const router = useRouter();

  const [checkingStorage, setCheckingStorage] = useState(true);
  const [loading, setLoading] = useState(false);

  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [schoolData, setSchoolData] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Check auto login
  useEffect(() => {
    const stored = localStorage.getItem("schoolDetails");
    if (stored) {
      const school = JSON.parse(stored);
      router.push(
        `/admin`
      );
      return;
    }
    setCheckingStorage(false);
  }, []);

  const onFormSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(`/admin`, {
        phone: values.phone,
        password: values.password,
      });

      setSchoolData(res.data.school);
      setOtpModal(true);
    } catch (err) {
      alert(err.response?.data?.message || "লগইন ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const verifyLoginOtp = async () => {
    if (!otp.trim()) return alert("অনুগ্রহ করে কোড লিখুন।");
    setVerifying(true);

    try {
      const res = await axios.post(`/api/school/verifyLoginOtp`, {
        schoolId: schoolData.schoolId,
        loginOTP: otp,
      });

      if (res.data.success) {
        localStorage.setItem("auth_token", res.data.token);
        localStorage.setItem("schoolDetails", JSON.stringify(schoolData));

        router.push(
          `/dashboard/${schoolData.schoolId}/admin`
        );
      } else {
        alert("ভুল কোড প্রদান করেছেন!");
      }
    } catch (err) {
      alert("যাচাই ব্যর্থ হয়েছে");
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
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      {/* OTP Modal */}
      {otpModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md shadow-2xl w-[330px] text-center">
            <h2 className="text-lg font-bold mb-3">OTP ভেরিফিকেশন</h2>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-3 border rounded-md w-full text-center text-lg tracking-widest"
              placeholder="৬ ডিজিট কোড"
            />

            <button
              onClick={verifyLoginOtp}
              disabled={verifying}
              className={`w-full mt-4 py-2 rounded-md text-white font-semibold 
                ${verifying ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {verifying ? "যাচাই হচ্ছে..." : "যাচাই করুন"}
            </button>

            <button
              onClick={() => setOtpModal(false)}
              className="mt-2 text-red-500 font-semibold"
            >
              বাতিল
            </button>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-4 w-[380px]">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Image src="/logo.png" alt="" width={24} height={24} />
          Smart Biddaloi
        </h1>

        <h2 className="text-gray-400 text-sm">আপনার অ্যাকাউন্টে লগইন করুন</h2>

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
                <label className="text-xs text-gray-500">ফোন নাম্বার</label>
                <input
                  name="phone"
                  type="text"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="p-2 rounded-md ring-1 ring-gray-300"
                  placeholder="Phone Number"
                />
                {errors.phone && touched.phone && (
                  <p className="text-xs text-red-400">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">পাসওয়ার্ড</label>
                <input
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="p-2 rounded-md ring-1 ring-gray-300"
                  placeholder="Password"
                />
                {errors.password && touched.password && (
                  <p className="text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px]"
              >
                {loading ? "লোড হচ্ছে..." : "Sign In"}
              </button>

              {/* Forgot password */}
              <p
                onClick={() => router.push("/ResetPasswordForm")}
                className="text-xs text-blue-600 hover:underline cursor-pointer text-center"
              >
                পাসওয়ার্ড ভুলে গেছেন? রিসেট করুন
              </p>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
