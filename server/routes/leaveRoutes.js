import express from "express";
import multer from "multer";
import { requestLeave, getLeaveRequests, updateLeaveStatus, downloadLeaveDocument } from "../controllers/leaveController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Routes
router.post("/", authMiddleware, upload.single("documents"), requestLeave);
router.get("/", authMiddleware, getLeaveRequests);
router.put("/:id/status", authMiddleware, updateLeaveStatus);
router.get("/:id/download", authMiddleware, downloadLeaveDocument);

export default router;
