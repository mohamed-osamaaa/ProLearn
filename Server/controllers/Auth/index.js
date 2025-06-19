import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';

import User from '../../models/User.js';
import generateJWT from '../../utils/generateJWT.js';

dotenv.config();
export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array(),
            });
        }

        const { name, email, password, phone, address } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role: "student",
        });

        await newUser.save();

        const token = await generateJWT({
            id: newUser._id,
            role: newUser.role,
            time: Date.now(),
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            data: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                role: newUser.role,
                phone: newUser.phone,
                address: newUser.address,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Password is incorrect",
            });
        }

        const token = await generateJWT({
            id: user._id,
            role: user.role,
            time: Date.now(),
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                fullname: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
export const checkAuth = async (req, res) => {
    const tokenUser = req.currentUser;

    if (!tokenUser) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access!",
        });
    }

    try {
        const user = await User.findById(tokenUser.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        res.status(200).json({
            success: true,
            message: "Authenticated user!",
            data: {
                id: user._id,
                fullname: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
            },
        });
    } catch (error) {
        console.error("Error in /check-auth:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
