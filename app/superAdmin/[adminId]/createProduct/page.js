"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImages } from "@/app/request/ImageUploads";
import { useParams } from "next/navigation";

const categoryOptions = [
  "Most Trending",
  "Popular",
  "New Arrival",
  "Best Seller",
  "Featured",
  "Top Rated",
  "Limited Stock",
  "Flash Sale",
  "Recommended",
  "Editor's Choice",
  "Premium",
  "Hot Deal",
  "Today’s Pick",
  "Clearance",
  "Special Offer",
];

// ✅ Updated validation schema
const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  price: Yup.number()
    .min(1, "Price must be at least 1")
    .required("Price is required"),
  discount: Yup.number()
    .min(0, "Discount cannot be negative")
    .required("Discount is required"),
  link: Yup.string().url("Must be a valid URL").required("Product link is required"),
  imageFile: Yup.mixed().required("Product image is required"),
  title: Yup.string().oneOf(categoryOptions, "Invalid category").required("Category is required"),
});

export default function ProductForm() {
  const params = useParams();
  const adminId = params?.adminId;

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);

      let uploadedUrl = "";
      if (values.imageFile) {
        const urls = await uploadImages([values.imageFile]);
        uploadedUrl = urls[0].url || urls[0];
      }

      const payload = {
        name: values.name,
        price: values.price,
        discount: values.discount,
        link: values.link,
        image: uploadedUrl,
        title: values.title,
        adminId: adminId,
      };

      await axios.post("/api/products", payload);

      alert("✅ Product uploaded successfully!");
      resetForm();
      setPreview(null);
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100 mt-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight">
        ➕ Add New Product
      </h2>

      {!adminId ? (
        <div className="text-red-600 font-semibold">AdminId missing from URL!</div>
      ) : (
        <Formik
          initialValues={{
            name: "",
            price: "",
            discount: 0,
            link: "",
            imageFile: null,
            title: "New Arrival",
          }}
          validationSchema={ProductSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="flex flex-col gap-6">
              
              {/* Product Name */}
              <div>
                <label className="label">Product Name</label>
                <Field name="name" className="input" />
                <ErrorMessage name="name" component="div" className="error" />
              </div>

              {/* Price & Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="label">Price (৳)</label>
                  <Field type="number" name="price" className="input" />
                  <ErrorMessage name="price" component="div" className="error" />
                </div>

                <div>
                  <label className="label">Discount (৳)</label>
                  <Field type="number" name="discount" className="input" />
                  <ErrorMessage name="discount" component="div" className="error" />
                </div>
              </div>

              {/* Link */}
              <div>
                <label className="label">Product Link</label>
                <Field name="link" className="input" />
                <ErrorMessage name="link" component="div" className="error" />
              </div>

              {/* Category */}
              <div>
                <label className="label">Category</label>
                <Field as="select" name="title" className="input">
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="title" component="div" className="error" />
              </div>

              {/* Image Upload */}
              <div>
                <label className="label">Product Image</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="upload-btn">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setFieldValue("imageFile", file);
                        setPreview(URL.createObjectURL(file));
                      }}
                    />
                  </label>

                  {preview ? (
                    <img
                      src={preview}
                      className="w-20 h-20 rounded-lg shadow-md object-cover"
                    />
                  ) : (
                    <div className="img-placeholder">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <ErrorMessage name="imageFile" component="div" className="error" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" /> Upload Product
                  </>
                )}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}

/* ---- EXTRA TAILWIND UTILITY CLASSES ---- */
