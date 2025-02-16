import { Types } from "mongoose";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

// Mark Attendance 
export const markAttendance = async (req, res) => {
    try {
        const { employeeId, status, checkIn, checkOut } = req.body;

        const date = getTodayDate();
        if (!employeeId || !date || !status) {
            return res.status(400).json({ message: "Employee ID, date, and status are required." });
        }

        const validStatuses = ["Present", "Absent", "Medical Leave", "Work from Home"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Valid statuses are 'Present', 'Absent', 'Leave'." });
        }

        const employee = await Employee.findById(employeeId);
        if (!employee || employee.status !== "Active") {
            return res.status(400).json({ message: "Only active employees can mark attendance." });
        }

        const existingAttendance = await Attendance.findOne({ employeeId, date });
        if (existingAttendance) {
            return res.status(400).json({ message: "Attendance already marked for this date." });
        }

        const attendance = await Attendance.create({ employeeId, date, status, checkIn, checkOut });
        res.status(201).json(attendance);
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ message: "Server error. Unable to mark attendance.", error: error.message });
    }
};

const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const todayAttendance = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = (!req.query.status || req.query.status == "") ? null : req.query.status;
        const search = (!req.query.search || req.query.search == "") ? null : req.query.search;
        const skip = (page - 1) * limit;
        const filter = {status: "Active"};

        if (search) {
            const regex = new RegExp(search, "i");
            filter["name"] = { $regex: regex };
        }
        const todayDate = getTodayDate();
        const employees = await Employee.find(filter);

        const employeeDataWithAttendance = await Promise.all(
            employees.map(async (employee) => {
                const attendance = await Attendance.findOne({
                    employeeId: employee._id,
                    date: todayDate
                }).exec();
                if(status) {
                    if (attendance && attendance.status && (attendance.status == status)) {
                        return {
                            employee,
                            attendanceStatus: attendance ? attendance.status : "Absent",
                            checkIn: attendance ? attendance.checkIn : null,
                            checkOut: attendance ? attendance.checkOut : null,
                        };
                    }
                    else return undefined;
                }
                else {
                    return {
                        employee,
                        attendanceStatus: attendance ? attendance.status : null,
                        checkIn: attendance ? attendance.checkIn : null,
                        checkOut: attendance ? attendance.checkOut : null,
                    };
                }
                
            })
        );

        const filteredEmployeeData = employeeDataWithAttendance.filter(item => item !== undefined);

        // Respond with the combined data
        res.json({
            success: true,
            data: filteredEmployeeData,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
