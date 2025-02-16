import { Types } from "mongoose";
import Employee from "../models/Employee.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

// Create an Employee
export const createEmployee = async (req, res) => {
    try {
        const { name, email, phone, position, department, role, dateOfJoining } = req.body;

        if (!name || !email || !phone || !position || !department || !role || !dateOfJoining) {
            return res.status(400).json({ message: "All fields (name, email, phone, position, department, role, dateOfJoining) are required." });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // if (!phoneRegex.test(phone)) {
        //     return res.status(400).json({ message: "Invalid phone number format. Use XXX-XXX-XXXX." });
        // }

        let employee = await Employee.findOne({ email });
        if (employee) return res.status(400).json({ message: "Employee already exists with this email." });

        employee = await Employee.create({ name, email, phone, position, department, role, dateOfJoining });

        res.status(201).json(employee);
    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
    }
};


// Get all Employees
export const getEmployees = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const filter = {};
        const position = (!req.query.position || req.query.position == "") ? null : req.query.position;
        const search = (!req.query.search || req.query.search == "") ? null : req.query.search;

        if (search) {
            const regex = new RegExp(search, "i");
            filter["name"] = { $regex: regex };
        }
        if (position) {
            filter["position"] = position;
        }
        const skip = (page - 1) * limit;
        const employees = await Employee.find(filter)
            .skip(skip)
            .limit(Number(limit))
            .sort({ name: 1 });

        const totalEmployees = await Employee.countDocuments(filter);

        res.status(200).json({
            employees,
            pagination: {
                totalEmployees,
                currentPage: Number(page),
                totalPages: Math.ceil(totalEmployees / limit),
                limit: Number(limit)
            }
        });
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Server error. Unable to fetch employees.", error: error.message });
    }
};


// Get Employee by ID
export const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid employee ID format." });
        }

        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        res.status(200).json(employee);
    } catch (error) {
        console.error("Error fetching employee by ID:", error);
        res.status(500).json({ message: "Server error. Unable to fetch employee.", error: error.message });
    }
};


// Update Employee
export const updateEmployee = async (req, res) => {
    try {
        const { name, email, phone, position, department, role, status, dateOfJoining } = req.body;

        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid employee ID format." });
        }

        if (!name && !email && !phone && !position && !department && !role && status === undefined && !dateOfJoining) {
            return res.status(400).json({ message: "At least one field is required to update." });
        }

        if (email) {
            const existingEmployeeWithEmail = await Employee.findOne({ email });
            if (existingEmployeeWithEmail && existingEmployeeWithEmail._id.toString() !== id) {
                return res.status(400).json({ message: "Email is already taken." });
            }
        }

        const employee = await Employee.findByIdAndUpdate(
            id,
            { name, email, phone, position, department, role, status, dateOfJoining },
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        res.status(200).json(employee);
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: "Server error. Unable to update employee.", error: error.message });
    }
};


// Delete Employee
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid employee ID format." });
        }

        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        await employee.deleteOne();

        res.status(200).json({ message: "Employee deleted successfully." });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: "Server error. Unable to delete employee.", error: error.message });
    }
};


// get postion
export const getEmployeePosition = async (req, res) => {
    try {

        const positions = await Employee.distinct('position');

        if (!positions) {
            return res.status(404).json({ message: "Positions not found." });
        }

        res.json({ message: "Positions list successfully", positions });
    } catch (error) {
        console.error("Error updating candidate status:", error);
        res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
    }
};

