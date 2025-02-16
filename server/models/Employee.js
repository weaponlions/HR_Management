import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    department: { type: String, required: false },
    dateOfJoining: { type: Date, required: false, 
      get: function (value) {
        let date = null;
        if (value) {
          date = new Date(value);
          date = date.toJSON().split("T")[0];
        }
        return date;
      },
      set: function (value) {
        if (value) {
          const date = new Date(value);
          return date;          
        }
        return null
      }
     },
    role: { type: String, enum: ["Admin", "HR", "Employee"], default: "Employee" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { 
    timestamps: true,
    toJSON: { getters: true }, 
    toObject: { getters: true }
   }
);

export default mongoose.model("Employee", employeeSchema);
