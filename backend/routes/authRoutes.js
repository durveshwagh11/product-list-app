import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { login, logout, me, refresh, signup } from '../controllers/authController.js';
import { requireAuth } from '../lib/auth.js';

const router = express.Router();

// brute-force protection for credential endpoints
const credentialsLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 10,
	message: { success: false, message: 'Too many attempts, try again later' },
});

router.post('/signup', credentialsLimiter, signup);
router.post('/login', credentialsLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
