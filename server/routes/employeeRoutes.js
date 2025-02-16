import express from "express";
import { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee, getEmployeePosition } from "../controllers/employeeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.post("/", authMiddleware, createEmployee);
router.get("/", authMiddleware, getEmployees);
router.get("/positions", authMiddleware, getEmployeePosition);
router.get("/:id", authMiddleware, getEmployeeById);
router.put("/:id", authMiddleware, updateEmployee);
router.delete("/:id", authMiddleware, deleteEmployee);

export default router;
