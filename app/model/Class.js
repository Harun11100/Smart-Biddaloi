import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true,
    },
    sectionName: {
      type: String,
    },
    schoolId: {
      type: String,
      required: true,
    },
    totalSubject:{
      type:Number,
      required:true
    },

    studentCount:{
       type: Number,
       required: true,
       default:0
    }
  },
  {
    timestamps: true, 
  }
);

export default mongoose.models.Class || mongoose.model("Class", ClassSchema);
