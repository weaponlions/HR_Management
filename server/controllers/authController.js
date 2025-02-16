import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields (name, email, password, role) are required." });
        }
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid email format." });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({ name, email, password: hashedPassword, role });

        return res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        console.error("Registration error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation error. Please check the provided data." });
        }

        return res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });

        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        if (error.name === "JsonWebTokenError") {
            return res.status(500).json({ message: "Token generation error. Please try again later." });
        }

        return res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
    }
};
