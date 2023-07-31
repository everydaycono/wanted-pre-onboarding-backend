import express from 'express';
import { signin, signup } from '../controller/authController.js';

/**
 * URL("/auth")
 * Router for authentication routes.
 */
const router = express.Router();

/**
 * POST /signup
 * Handles the POST request for user signup.
 */
router.post('/signup', signup);

/**
 * POST /signin
 * Handles the POST request for user signin.
 */
router.post('/signin', signin);

export default router;
