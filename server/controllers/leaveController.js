import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import fs from "fs";
import path from "path";


// Create Leave Request
export const requestLeave = async (req, res) => {
    try {
        const { employeeId, startDate, endDate, reason } = req.body;
        const documents = req.file ? req.file.path : null;

        if (!employeeId || !startDate || !endDate || !reason) {
            return res.status(400).json({ message: "All fields (employeeId, startDate, endDate, reason) are required." });
        }

        const employee = await Employee.findById(employeeId);
        if (!employee || employee.status !== "Active") {
            return res.status(400).json({ message: "Only active employees can request leave." });
        }

        const leave = await Leave.create({ employeeId, startDate, endDate, reason, documents });
        return res.status(201).json(leave);
    } catch (error) {
        console.error("Error creating leave request:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// Get all Leave Requests (Filtered)
export const getLeaveRequests = async (req, res) => {
    try {
        const { status, employeeId } = req.query;
        let filter = {};

        if (employeeId) filter.employeeId = employeeId;
        if (status) filter.status = status;

        const leaveRequests = await Leave.find(filter).populate("employeeId", "name email position");
        res.json(leaveRequests);
    } catch (error) {
        console.error("Error fetching leave requests:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// Approve or Reject Leave Request
export const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["Pending", "Approved", "Rejected"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Valid statuses are 'Pending', 'Approved', or 'Rejected'." });
        }

        const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!leave) {
            return res.status(404).json({ message: "Leave request not found." });
        }

        res.json(leave);
    } catch (error) {
        console.error("Error updating leave status:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// Download Leave Documents
export const downloadLeaveDocument = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave || !leave.documents) {
            return res.status(404).json({ message: "Document not found." });
        }

        const filePath = path.resolve(leave.documents);
        res.download(filePath, (err) => {
            if (err) {
                console.error("Error downloading leave document:", err);
                return res.status(500).json({ message: "Failed to download the document.", error: err.message });
            }
        });
    } catch (error) {
        console.error("Error downloading leave document:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
