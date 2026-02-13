"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { uploadImages } from "@/app/request/ImageUploads";

const validationSchema = Yup.object().shape({
  schoolName: Yup.string().required("School name is required"),
  principalName: Yup.string().required("Principal name is required"),
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
    .required("Phone number is required"),
  contactNumber: Yup.string()
    .matches(/^[0-9]{11}$/, "Contact number must be 11 digits")
    .required("Contact number is required"),
});

export default function SchoolSettingsClientsPage({ schoolData }) {
  const router = useRouter();

  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(schoolData?.logo?.url || null);
  const [coverPreview, setCoverPreview] = useState(schoolData?.cover?.url || null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "logo") {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const onFormSubmit = async (values) => {
    setLoading(true);
    try {
      let uploadedLogo = logoPreview;
      let uploadedCover = coverPreview;

      // Upload new files if selected
      if (logoFile) {
        [uploadedLogo] = await uploadImages([logoFile]);
      }
      if (coverFile) {
        [uploadedCover] = await uploadImages([coverFile]);
      }

      const payload = {
        ...values,
        logo: uploadedLogo,
        cover: uploadedCover,
        schoolId: schoolData._id,
      };

      await axios.put("/api/school/updateSchool", payload);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!schoolData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8 mt-6">School Profile Settings</h1>

      <Formik
        initialValues={{
          principalName: schoolData.principalName || "",
          schoolName: schoolData.schoolName || "",
          email: schoolData.email || "",
          phone: schoolData.phone || "",
          contactNumber: schoolData.contactNumber || "",
        }}
        validationSchema={validationSchema}
        onSubmit={onFormSubmit}
      >
        {() => (
          <Form className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6">
            
            {/* Cover Image */}
            <label className="relative cursor-pointer block w-full h-48 rounded-2xl overflow-hidden bg-gray-200">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                  Click to upload cover image
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleImageChange(e, "cover")}
              />
            </label>

            {/* Logo */}
            <div className="relative w-32 h-32 mx-auto -mt-16 rounded-full border-4 border-indigo-500 overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                  Upload Logo
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleImageChange(e, "logo")}
              />
            </div>

            {/* Form Inputs */}
            {[
              { label: "School Name", field: "schoolName" },
              { label: "Principal Name", field: "principalName" },
              { label: "Phone Number", field: "phone" },
              { label: "Contact Number", field: "contactNumber" },
            ].map((input) => (
              <div key={input.field} className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">{input.label}</label>
                <Field
                  type="text"
                  name={input.field}
                  placeholder={`Enter ${input.label}`}
                  className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                />
                <ErrorMessage
                  name={input.field}
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            ))}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
