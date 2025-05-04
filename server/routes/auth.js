import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js'; // ✅ Middleware pro ověření tokenu

const router = express.Router();

// ✅ Endpointy pro autentizaci
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticate, getUserProfile);

export default router;