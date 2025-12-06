import axios from "axios";

export const uploadImages = async (images) => {
  try {
    const formData = new FormData();

    images.forEach((file) => formData.append("file", file));
    formData.append("path", "advertise"); // optional folder

    const response = await axios.post("/api/cloudinaryProductUpload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    });

    if (!response?.data || !Array.isArray(response.data.urls)) {
      throw new Error("No images returned from server");
    }

    return response.data.urls; // [{ url, public_id }]
  } catch (err) {
    console.error("Images upload failed:", err.response?.data || err.message);
    throw err;
  }
};
