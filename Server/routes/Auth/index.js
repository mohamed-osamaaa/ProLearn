import express from 'express';

import {
    checkAuth,
    login,
    logout,
    register,
} from '../../controllers/Auth/index.js';
import {
    validateLogin,
    validateRegister,
} from '../../middlewares/authValidation.js';
import verifyToken from '../../middlewares/verifyToken.js';

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/check-auth", verifyToken, checkAuth);
router.post("/logout", verifyToken, logout);


export default router;