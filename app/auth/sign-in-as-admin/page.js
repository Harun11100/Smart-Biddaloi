"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Phone, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-login check
  useEffect(() => {
    const stored = localStorage.getItem("schoolDetails");
    if (stored) {
      try {
        const school = JSON.parse(stored);
        if (school?.slug) {
          router.push(`/admin/${school.slug}`);
          return;
        }
      } catch (err) {
        localStorage.removeItem("schoolDetails");
      }
    }
    setCheckingStorage(false);
  }, [router]);

  // Handle direct login submission
  const onFormSubmit = async (values) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.post(`/api/school/login`, {
        phone: values.phone,
        password: values.password,
      });

      if (res.data?.school) {
        const school = res.data.school;
        const token = res.data.token || res.data.accessToken || "";

        // Save auth state directly
        if (token) localStorage.setItem("auth_token", token);
        localStorage.setItem("schoolDetails", JSON.stringify(school));

        // Redirect immediately
        router.push(`/admin/${school.slug}`);
      } else {
        setErrorMessage(res.data?.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Login failed. Please check your network or credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fullscreen Loading State
  if (checkingStorage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-slate-400 text-xs font-medium tracking-wide">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 overflow-hidden">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 blur-[130px] rounded-full pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl shadow-emerald-950/20">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-inner">
            <Image
              src="/icon.png"
              alt="School Logo"
              width={42}
              height={42}
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Barenda Sabuj Kanan School & College 
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Admin Portal Access & Control Management
            </p>
          </div>
        </div>

        {/* Global Error Alert Banner */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium text-center animate-fadeIn">
            {errorMessage}
          </div>
        )}

        {/* Formik Form */}
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
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Phone size={13} className="text-emerald-400" />
                  <span>Phone Number</span>
                </label>
                <div className="relative">
                  <input
                    name="phone"
                    type="text"
                    maxLength={11}
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. 01712345678"
                    className={`w-full bg-slate-950/60 border ${
                      errors.phone && touched.phone
                        ? "border-rose-500/80 focus:ring-rose-500/30"
                        : "border-slate-800 focus:border-emerald-500/80 focus:ring-emerald-500/20"
                    } text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-4 transition duration-200 placeholder:text-slate-600`}
                  />
                </div>
                {errors.phone && touched.phone && (
                  <p className="text-[11px] font-medium text-rose-400 mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock size={13} className="text-emerald-400" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    className={`w-full bg-slate-950/60 border ${
                      errors.password && touched.password
                        ? "border-rose-500/80 focus:ring-rose-500/30"
                        : "border-slate-800 focus:border-emerald-500/80 focus:ring-emerald-500/20"
                    } text-white text-sm rounded-xl pl-4 pr-11 py-3 outline-none focus:ring-4 transition duration-200 placeholder:text-slate-600`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-[11px] font-medium text-rose-400 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Forgot Password Link */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => router.push("/ResetPasswordForm")}
                  className="text-xs text-slate-400 hover:text-emerald-400 transition underline underline-offset-4"
                >
                  Forgot password? Reset from mobile app
                </button>
              </div>

            </form>
          )}
        </Formik>

        {/* Footer Security Badge */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>Encrypted Authorized Admin Console</span>
        </div>

      </div>
    </div>
  );
}