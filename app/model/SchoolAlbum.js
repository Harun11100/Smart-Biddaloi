// models/SchoolAlbum.js
import mongoose from "mongoose";

const schoolAlbumSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  photo:{
    public_id: { type: String },
    url: { type: String},
  },
  photoLimit: { type: Number, default: 100 },
  caption: String,
  eventName: String,
  uploadedAt: { type: Date, default: Date.now }, 
});

export default mongoose.models.SchoolAlbum || mongoose.model("SchoolAlbum", schoolAlbumSchema);
