"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { uploadImages } from "@/app/request/ImageUploads";

const validationSchema = Yup.object().shape({
  schoolName: Yup.string().required("স্কুল এর নাম আবশ্যক"),
  principalName: Yup.string().required("প্রধান শিক্ষকের নাম আবশ্যক"),
  email: Yup.string().email("সঠিক ইমেইল দিন").required("ইমেইল আবশ্যক"),
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, "ফোন নাম্বার ১১ সংখ্যার হতে হবে")
    .required("ফোন নাম্বার আবশ্যক"),
  contactNumber: Yup.string()
    .matches(/^[0-9]{11}$/, "যোগাযোগ নাম্বার ১১ সংখ্যার হতে হবে")
    .required("যোগাযোগ নাম্বার আবশ্যক"),
  union: Yup.string().required("ইউনিয়নের নাম আবশ্যক"),
  district: Yup.string().required("জেলার নাম আবশ্যক"),
  secretName: Yup.string().required("সিক্রেট নাম আবশ্যক"),
  password: Yup.string()
    .min(6, "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে")
    .required("পাসওয়ার্ড আবশ্যক"),
  wordNo: Yup.string().required("ওয়ার্ড নং আবশ্যক"),
  clientId: Yup.string().required("গ্রাহক আইডি আবশ্যক"),
  terms: Yup.boolean().oneOf([true], "শর্তাবলী মেনে নিতে হবে"),
});

export default function SchoolRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [logoUri, setLogoUri] = useState(null);
  const [coverUri, setCoverUri] = useState(null);

  const logoRef = useRef(null);
  const coverRef = useRef(null);

  // FIXED FILE HANDLER
  const handleFileChange = (e, type = "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");
      return;
    }

    const url = URL.createObjectURL(file);

    if (type === "logo") {
      setLogoPreview({ url });
      setLogoUri(file);
    } else {
      setCoverPreview({ url });
      setCoverUri(file);
    }
  };

  // FIXED SUBMIT FUNCTION (OUTSIDE handler)
  const onFormSubmit = async (values, { resetForm }) => {
    setLoading(true);

    try {
      let logoUrl = "";
      let coverUrl = "";

      // Upload logo
      if (logoUri) {
        const formData = new FormData();
        formData.append("file", logoUri);
        const [res] = await uploadImages(formData);
        logoUrl = res;
      }

      // Upload cover
      if (coverUri) {
        const formData = new FormData();
        formData.append("file", coverUri);
        const [res] = await uploadImages(formData);
        coverUrl = res;
      }

      const payload = {
        ...values,
        logo: logoUrl,
        cover: coverUrl,
      };

      await axios.post("/api/school/register", payload);

      alert("Form submitted successfully!");

      resetForm();
      setLogoPreview(null);
      setCoverPreview(null);
      setLogoUri(null);
      setCoverUri(null);

      router.push("/superAdmin/login");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "কিছু ভুল হয়েছে");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">

        <h1 className="text-center text-2xl font-bold text-blue-800 mb-5">
          এডমিন রেজিস্ট্রেশন
        </h1>

        <Formik
          initialValues={{
            schoolName: "",
            principalName: "",
            email: "",
            phone: "",
            contactNumber: "",
            union: "",
            district: "",
            secretName: "",
            password: "",
            clientId: "",
            wordNo: "",
            terms: false,
          }}
          validationSchema={validationSchema}
          onSubmit={onFormSubmit}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, touched, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              
              {/* COVER UPLOAD */}
              <div className="mb-4">
                <label className="text-sm font-medium">কভার ছবি</label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center">
                    {coverPreview ? (
                      <img src={coverPreview.url} className="w-full h-full object-cover rounded" />
                    ) : (
                      "কভার নেই"
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "cover")}
                  />
                </div>
              </div>

              {/* LOGO UPLOAD */}
              <div className="mb-6">
                <label className="text-sm font-medium">লোগো</label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview.url} className="w-full h-full object-cover" />
                    ) : (
                      "লোগো নেই"
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "logo")}
                  />
                </div>
              </div>

              {/* FORM INPUTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "স্কুলের নাম", field: "schoolName" },
                  { label: "প্রধান শিক্ষকের নাম", field: "principalName" },
                  { label: "ইমেইল", field: "email" },
                  { label: "মোবাইল নাম্বার", field: "phone" },
                  { label: "যোগাযোগ নাম্বার", field: "contactNumber" },
                  { label: "ওয়ার্ড নং", field: "wordNo" },
                  { label: "গ্রাহক আইডি", field: "clientId" },
                  { label: "ইউনিয়ন/গ্রাম", field: "union" },
                  { label: "সিক্রেট নাম", field: "secretName" },
                  { label: "পাসওয়ার্ড", field: "password", type: "password" },
                ].map((input) => (
                  <div key={input.field}>
                    <label className="text-sm">{input.label}</label>
                    <input
                      type={input.type || "text"}
                      name={input.field}
                      value={values[input.field]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="border w-full px-3 py-2 rounded"
                    />

                    {touched[input.field] && errors[input.field] && (
                      <p className="text-red-600 text-sm">{errors[input.field]}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* DISTRICT */}
              <div className="mt-4">
                <label className="text-sm">জেলা নির্বাচন</label>
                <select
                  name="district"
                  value={values.district}
                  onChange={handleChange}
                  className="border w-full px-3 py-2 rounded"
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="dhaka">ঢাকা</option>
                  <option value="gazipur">গাজীপুর</option>
                  <option value="narayanganj">নারায়ণগঞ্জ</option>
                  <option value="chittagong">চট্টগ্রাম</option>
                  <option value="others">অন্যান্য</option>
                </select>

                {touched.district && errors.district && (
                  <p className="text-red-600 text-sm">{errors.district}</p>
                )}
              </div>

              {/* TERMS */}
              <div className="mt-6 p-4 border rounded bg-white">
                <h3 className="font-semibold">শর্তাবলী:</h3>
                <div className="max-h-32 overflow-auto text-sm mt-2">
                  <p>১. সিস্টেম সঠিকভাবে ব্যবহার করতে হবে।</p>
                  <p>২. ভুল তথ্য দিলে অ্যাকাউন্ট বাতিল হতে পারে।</p>
                </div>

                <label className="mt-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={values.terms}
                    onChange={(e) => setFieldValue("terms", e.target.checked)}
                  />
                  <span>আমি শর্তাবলী মেনে নিচ্ছি</span>
                </label>

                {errors.terms && touched.terms && (
                  <p className="text-red-600 text-sm">{errors.terms}</p>
                )}
              </div>

              <div className="mt-6 text-center">
                <button
                  type="submit"
                  disabled={!values.terms || loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded"
                >
                  {loading ? "প্রসেস হচ্ছে..." : "রেজিস্টার করুন"}
                </button>
              </div>

            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
