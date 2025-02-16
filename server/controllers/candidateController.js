import Candidate from "../models/Candidate.js";
import fs from "fs";
import { Types } from "mongoose";
import path from "path";
import Employee from "../models/Employee.js";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


// Create a new candidate
export const createCandidate = async (req, res) => {
  try {
    const { name, email, phone, position, experience } = req.body;
    const resume = req.file ? req.file.path : null;

    if (!name || !email || !phone || !position || !experience) {
      return res.status(400).json({ message: "All fields (name, email, phone, position, experience) are required." });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res.status(400).json({ message: "Candidate with this email already exists." });
    }

    if (resume) {
      const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const fileMimeType = req.file.mimetype;

      if (!allowedMimeTypes.includes(fileMimeType)) {
        return res.status(400).json({ message: "Invalid resume file type. Only PDF or DOCX files are allowed." });
      }
    }

    const candidate = await Candidate.create({ name, email, phone, position, resume, experience });
    return res.status(201).json(candidate);
  } catch (error) {
    console.error("Error creating candidate:", error);
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
  }
};


// Get all candidates
export const getCandidates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = (!req.query.status || req.query.status == "") ? null : req.query.status;
    const search = (!req.query.search || req.query.search == "") ? null : req.query.search;
    const position = (!req.query.position || req.query.position == "") ? null : req.query.position;
    const skip = (page - 1) * limit;
    const filter = {};
    if(status){
      filter["status"] = {status};
    }
    else filter["status"] = { $ne: "Selected" };
    if(position){
      filter["position"] = position;
    }
    if(search){
      const regex = new RegExp(search, "i");
      filter["name"] = { $regex: regex };
    }
    const candidates = await Candidate.find(filter).skip(skip).limit(limit);
    const totalCandidates = await Candidate.countDocuments();

    res.json({
      page,
      limit,
      totalCandidates,
      totalPages: Math.ceil(totalCandidates / limit),
      candidates
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message
    });
  }
};


// Get a single candidate by ID
export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid candidate ID format." });
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    res.json(candidate);
  } catch (error) {
    console.error("Error fetching candidate by ID:", error);
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
  }
};


// Update candidate information
export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, position, experience } = req.body;
    const newResume = req.file ? req.file.path : null;

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    if (email && email !== candidate.email) {
      const existingCandidate = await Candidate.findOne({ email });
      if (existingCandidate) {
        return res.status(400).json({ message: "Email is already taken." });
      }
    }

    if (newResume && candidate.resume) {
      fs.unlinkSync(candidate.resume);
    }

    candidate.name = name || candidate.name;
    candidate.email = email || candidate.email;
    candidate.phone = phone || candidate.phone;
    candidate.position = position || candidate.position;
    candidate.experience = experience || (candidate.experience ?? "0");
    candidate.resume = newResume || candidate.resume;

    await candidate.save();

    res.json(candidate);
  } catch (error) {
    console.error("Error updating candidate:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update candidate status
export const updateCandidateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid candidate ID format." });
    }
    const validStatuses = ["New", "Applied", "Interview", "Selected", "Rejected", "Scheduled", "Ongoing"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status. Valid options are 'Applied', 'Interview', 'Selected', 'Rejected'." });
    }

    const candidate = await Candidate.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    if (status === "Selected") {
      const candidate = await Candidate.findById(id);
      const employee = await Employee.create({ name: candidate.name, email: candidate.email, phone: candidate.phone, position: candidate.position, department: "", dateOfJoining: "" });
    }
    res.json({ message: "Candidate status updated successfully", candidate });
  } catch (error) {
    console.error("Error updating candidate status:", error);
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
  }
};


// Delete candidate
export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid candidate ID format." });
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    if (candidate.resume) {
      try {
        await fs.promises.unlink(candidate.resume);
      } catch (fileError) {
        console.error("Error deleting resume file:", fileError);
      }
    }

    await candidate.deleteOne();
    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
  }
};


// Download Resume    
export const downloadResume = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid candidate ID format." });
    }

    const candidate = await Candidate.findById(id);
    if (!candidate || !candidate.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const filePath = path.resolve(candidate.resume);

    const allowedDirectory = path.resolve("./");
    if (!filePath.startsWith(allowedDirectory)) {
      return res.status(400).json({ message: "Invalid file path" });
    }

    res.download(filePath, (err) => {
      if (err) {
        console.error("Error downloading resume:", err);
        return res.status(500).json({ message: "Failed to download the resume.", error: err.message });
      }
    });
  } catch (error) {
    console.error("Error downloading resume:", error);
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
  }
};

// get candidate status
export const getCandidatePosition = async (req, res) => {
  try {

    const positions = await Candidate.distinct('position');

    if (!positions) {
      return res.status(404).json({ message: "Positions not found." });
    }

    res.json({ message: "Positions list successfully", positions });
  } catch (error) {
    console.error("Error updating candidate status:", error);
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
  }
};

