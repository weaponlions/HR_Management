import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    position: { type: String, required: true }, 
    experience: { type: String, required: true },
    resume: { type: String, required: false }, // Stores file path or URL
    status: { type: String, enum: ["Applied", "Interview", "Selected", "Rejected"], default: "Applied" },
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);
