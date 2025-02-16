import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    startDate: {
      type: Date, required: true,
      get: function (value) {
        let date = null;
        if (value) {
          date = new Date(value);
          date = date.toJSON().split("T")[0];
        }
        return date;
      },
    },
    endDate: {
      type: Date, required: true,
      get: function (value) {
        let date = null;
        if (value) {
          date = new Date(value);
          date = date.toJSON().split("T")[0];
        }
        return date;
      },
    },
    reason: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    documents: { type: String }, // Stores file path or URL
  },
  { timestamps: true, toJSON: { getters: true } }
);

export default mongoose.model("Leave", leaveSchema);
