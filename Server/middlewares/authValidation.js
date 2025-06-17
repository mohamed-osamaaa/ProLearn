import { body } from 'express-validator';

export const validateRegister = [
    body("name")
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Full name must be between 2 and 50 characters")
        .trim(),

    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
        )
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),

    body("phone")
        .notEmpty()
        .withMessage("Phone number is required")
        .isMobilePhone()
        .withMessage("Please provide a valid phone number")
        .trim(),

    body("address")
        .notEmpty()
        .withMessage("Address is required")
        .isLength({ min: 10, max: 200 })
        .withMessage("Address must be between 10 and 200 characters")
        .trim(),
];

export const validateLogin = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 1 })
        .withMessage("Password cannot be empty"),
];
