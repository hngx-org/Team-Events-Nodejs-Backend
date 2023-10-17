import { Router } from 'express';
import {
	callback,
	googleAuth,
	registerUser,
	loginUser,
	logout,
	twitterAuth,
	twitterAuthCallback,
	forgotPassword,
	resetPassword,
	verifyEmail,
} from '../Controllers/auth.controller';
const router = Router();

/* @GET /auth/google
 * This route should take care of login and signup
 */
router.get('/google', googleAuth);
router.get('/callback', callback);

/* @Post /auth/signup
 * Handle user registration
 */
router.post('/signup', registerUser);

/* @Post /auth/login
 * Handle user login
 */
router.post('/login', loginUser);

/* @Post /auth/signup
 * Handle user registration
 */
router.post('/verify-email', verifyEmail);

// Route to request a password reset
router.post('/forgot-password', forgotPassword);

// Route to handle the password reset
router.post('/reset-password', resetPassword);

/* @Post /auth/logout
 *This route should take care of login out
 */
router.post('/logout', logout);

/* @Post /auth/twitter
 *This route should take care of login and signup
 */
router.get('/twitter', twitterAuth);
router.get('/twitter/callback', twitterAuthCallback);

export default router;
