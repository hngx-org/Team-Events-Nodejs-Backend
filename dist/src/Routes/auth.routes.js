"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../Controllers/auth.controller");
const router = (0, express_1.Router)();
/* @GET /auth/google
 * This route should take care of login and signup
 */
router.get('/google', auth_controller_1.googleAuth);
router.get('/callback', auth_controller_1.callback);
/* @Post /auth/signup
 * Handle user registration
 */
router.post('/signup', auth_controller_1.registerUser);
/* @Post /auth/login
 * Handle user login
 */
router.post('/login', auth_controller_1.loginUser);
/* @Post /auth/verify-email
 * Handle user registration
 */
router.get('/verify-email', auth_controller_1.verifyEmail);
// Route to request a password reset
router.post('/forgot-password', auth_controller_1.forgotPassword);
// Route to handle the password reset
router.post('/reset-password', auth_controller_1.resetPassword);
/* @Post /auth/logout
 *This route should take care of login out
 */
router.post('/logout', auth_controller_1.logout);
/* @Post /auth/twitter
 *This route should take care of login and signup
 */
router.get('/twitter', auth_controller_1.twitterAuth);
router.get('/twitter/callback', auth_controller_1.twitterAuthCallback);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map