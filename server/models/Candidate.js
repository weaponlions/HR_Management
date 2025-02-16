import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    position: { type: String, required: true }, 
    experience: { type: String, required: true },
    resume: { type: String, required: false },
    status: { type: String, enum: ["New", "Applied", "Interview", "Selected", "Rejected", "Scheduled", "Ongoing"], default: "Applied" },
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);
