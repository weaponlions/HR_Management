import express from "express";
import multer from "multer";
import { createCandidate, getCandidates, getCandidateById, updateCandidateStatus, deleteCandidate, downloadResume, updateCandidate, getCandidatePosition } from "../controllers/candidateController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
    cb(null, true);
  };
const upload = multer({ storage, fileFilter });

// Routes
router.post("/", authMiddleware, upload.single("resume"), createCandidate);
router.get("/", authMiddleware, getCandidates);
router.get("/positions", authMiddleware, getCandidatePosition);
router.get("/:id", authMiddleware, getCandidateById);
router.put("/:id", authMiddleware, upload.single("resume"), updateCandidate);
router.put("/:id/status", authMiddleware, updateCandidateStatus);
router.delete("/:id", authMiddleware, deleteCandidate);
router.get("/:id/download", authMiddleware, downloadResume);

export default router;
