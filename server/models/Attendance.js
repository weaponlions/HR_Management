import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent", "Medical Leave", "Work from Home"], required: true },
    checkIn: { type: String },
    checkOut: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
