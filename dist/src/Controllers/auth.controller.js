"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.twitterAuthCallback = exports.twitterAuth = exports.resetPassword = exports.registerUser = exports.logout = exports.loginUser = exports.googleAuth = exports.forgotPassword = exports.callback = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mail_config_1 = __importDefault(require("./../config/mail.config"));
const joi_1 = __importDefault(require("joi"));
const passport_1 = __importDefault(require("passport"));
const google_config_1 = require("../config/google.config");
const utils_1 = require("../utils");
const crypto_1 = require("crypto");
const prisma = new client_1.PrismaClient();
// Google Authentication
const googleAuth = (req, res) => {
    res.redirect(google_config_1.authUrl);
};
exports.googleAuth = googleAuth;
const callback = async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = await google_config_1.oauth2Client.getToken(code);
        google_config_1.oauth2Client.setCredentials(tokens);
        const oauth2 = google_config_1.google.oauth2({ version: 'v2', auth: google_config_1.oauth2Client });
        const { data } = await oauth2.userinfo.get();
        const userExists = await prisma.user.findFirst({
            where: {
                auth_id: data.id,
            },
        });
        if (!userExists) {
            const newUser = await prisma.user.create({
                data: {
                    auth_method: 'google',
                    auth_id: data.id,
                    email: data.email ? data.email : null,
                    username: data.name,
                    avatar: data.picture,
                },
            });
            // generate accessToken
            const token = (0, utils_1.generateToken)(newUser.id);
            // return token
            res.status(201).json({
                statusCode: 201,
                message: 'Account created successfully',
                token,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    username: newUser.username,
                    avatar: newUser.avatar,
                },
            });
        }
        else {
            // generate access token
            const token = (0, utils_1.generateToken)(userExists.id);
            // return token
            res.status(200).json({
                statusCode: 200,
                message: 'Login successful',
                token,
                user: {
                    id: userExists.id,
                    email: userExists.email,
                    username: userExists.username,
                    avatar: userExists.avatar,
                },
            });
        }
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(500).send('Invalid credentials');
    }
    finally {
        // Close the Prisma client at the end of the function
        prisma.$disconnect();
    }
};
exports.callback = callback;
// Basic Authentication
const registerUser = async (req, res) => {
    try {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(8).required(),
            name: joi_1.default.string(),
        });
        const { error, value } = schema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        const { email, password, name } = value;
        // Check if the email is already in use
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser)
            return res.status(409).json({ error: 'Email is already in use' });
        // Generate an email verification token
        const emailVerificationToken = (0, crypto_1.randomUUID)();
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 24);
        // Hash the password
        const hashedPassword = await (0, utils_1.hashPassword)(password);
        // Create a new user with the email verification data
        const user = await prisma.user.create({
            data: {
                auth_method: 'basic',
                email,
                username: name,
                password: hashedPassword,
                email_verification_token: emailVerificationToken,
                email_verification_expires: expirationTime,
            },
        });
        // Send an email with the email verification link
        (0, utils_1.sendVerificationEmail)(user.email, user.email_verification_token);
        res.status(201).json({ message: 'Sign up successful. A verification link has been sent to your email.' });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
};
exports.registerUser = registerUser;
const verifyEmail = async (req, res) => {
    try {
        const redirectURL = 'http://localhost:3000/dashboard/?email_verified=';
        const { token } = req.query;
        const user = await prisma.user.findFirst({
            where: {
                email_verification_token: token,
                email_verification_expires: {
                    gte: new Date(),
                },
            },
        });
        // Check if the token is valid
        if (!user) {
            return res.redirect(redirectURL + "false&error='Invalid or expired token'");
        }
        // Mark the user's email as verified
        await prisma.user.update({
            where: { id: user.id },
            data: {
                email_verified: true,
                email_verification_token: null,
                email_verification_expires: null,
            },
        });
        res.redirect(redirectURL + 'true&message=Email verified successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during email verification' });
    }
};
exports.verifyEmail = verifyEmail;
const loginUser = async (req, res) => {
    try {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(8).required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
        });
        // Check if the user with the given email exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        // Verify the password
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password); // Compare the hashed password
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        const token = (0, utils_1.generateToken)(user.id);
        // return token
        res.status(200).json({
            statusCode: 200,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'An error occurred while logging in.' });
    }
};
exports.loginUser = loginUser;
// Function to handle password reset request
const forgotPassword = async (req, res) => {
    try {
        const requestSchema = joi_1.default.object({
            email: joi_1.default.string().required().email(),
            resetUrl: joi_1.default.string(),
        });
        const { error, value } = requestSchema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        const { email, resetUrl } = value;
        //check if a user with this email exist
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        // Generate resetToken
        const salt = await bcryptjs_1.default.genSalt(10);
        const resetToken = await bcryptjs_1.default.hash(user.id, salt);
        const tokenExpireDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        // Save the reset token and expiration date in the user's record
        await prisma.user.update({
            where: { id: user.id },
            data: {
                reset_password_token: resetToken,
                reset_password_expires: tokenExpireDate,
            },
        });
        // Send email
        let resetLink = resetUrl || 'https://event-tan-iota.vercel.app/auth/reset-password';
        resetLink = `${resetLink}?token=${resetToken}`;
        await sendPasswordResetEmail(email, resetLink);
        return res.status(200).json({ message: 'Password reset email sent successfully' });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: 'An error occurred while trying to process forget password request!' });
    }
};
exports.forgotPassword = forgotPassword;
// Function to handle password reset
const resetPassword = async (req, res) => {
    try {
        const requestSchema = joi_1.default.object({
            resetToken: joi_1.default.string().required(),
            password: joi_1.default.string().min(8).required(),
        });
        const { error, value } = requestSchema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        const { resetToken, password } = value;
        // Find a user by the reset token
        const user = await prisma.user.findFirst({
            where: {
                reset_password_token: resetToken,
                reset_password_expires: { gte: new Date() },
            },
        });
        if (!user)
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        // Hash the new password and update the user's password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                reset_password_token: null,
                reset_password_expires: null,
            },
        });
        return res.status(200).json({ message: 'Password reset successful' });
    }
    catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ error: 'An error occurred while resetting the password' });
    }
};
exports.resetPassword = resetPassword;
const logout = (req, res) => {
    // req.logout();
    res.status(200).json({});
};
exports.logout = logout;
// Twitter Authentication
const twitterAuth = (req, res) => {
    // start the twitter authentication flow
    passport_1.default.authenticate('twitter');
};
exports.twitterAuth = twitterAuth;
const twitterAuthCallback = (req, res) => {
    passport_1.default.authenticate('twitter', (err, user) => {
        if (err) {
            // Handle authentication errors
            return res.status(500).json({ error: 'Authentication error' });
        }
        if (!user) {
            // Authentication failed
            return res.status(401).json({ error: 'Authentication failed' });
        }
        // Authentication succeeded
        const accessToken = (0, utils_1.generateToken)(user.id);
        res.status(200).json({ user, accessToken });
    })(req, res);
};
exports.twitterAuthCallback = twitterAuthCallback;
// Helper function
async function sendPasswordResetEmail(email, resetLink) {
    const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: email,
        subject: 'Password Reset',
        html: `<p>Click on the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    };
    try {
        await mail_config_1.default.sendMail(mailOptions);
    }
    catch (error) {
        console.error('Error sending password reset email:', error);
    }
}
//# sourceMappingURL=auth.controller.js.map