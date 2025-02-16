import express from "express";
import { markAttendance, todayAttendance } from "../controllers/attendanceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.post("/", authMiddleware, markAttendance);
router.get("/today", authMiddleware, todayAttendance);

export default router;
