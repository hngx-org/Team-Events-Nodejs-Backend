import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { authUrl, oauth2Client, google } from '../config/google.config';
import { generateToken } from '../utils';
import passport from 'passport';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import { randomUUID } from 'crypto';
import { hashPassword } from '../utils/hashPassword';
import { sendVerificationEmail } from '../utils/sendVerificationEmail';

const prisma = new PrismaClient();

// Google Authentication
const googleAuth = (req: Request, res: Response) => {
	res.redirect(authUrl);
};

const callback = async (req: Request, res: Response) => {
	const code = req.query.code as string;

	try {
		const { tokens } = await oauth2Client.getToken(code);
		oauth2Client.setCredentials(tokens);

		const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
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
			const token: string = generateToken(newUser.id);
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
		} else {
			// generate access token
			const token: string = generateToken(userExists.id);
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
	} catch (error) {
		console.error('Authentication error:', error);
		res.status(500).send('Invalid credentials');
	} finally {
		// Close the Prisma client at the end of the function
		prisma.$disconnect();
	}
};

// Basic Authentication
const registerUser = async (req: Request, res: Response) => {
	try {
		const schema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().min(8).required(),
			name: Joi.string(),
		});

		const { error, value } = schema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const { email, password, name } = value;
		// Check if the email is already in use
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});
		if (existingUser) return res.status(409).json({ error: 'Email is already in use' });

		// Generate an email verification token
		const emailVerificationToken = randomUUID();
		const expirationTime = new Date();
		expirationTime.setHours(expirationTime.getHours() + 24);

		// Hash the password
		const hashedPassword = await hashPassword(password);

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
		sendVerificationEmail(user.email, user.email_verification_token);

		res.status(201).json({ message: 'User registered successfully.' });
	} catch (error) {
		console.error('Error registering user:', error);
		res.status(500).json({ error: 'An error occurred during registration' });
	}
};

const verifyEmail = async (req: Request, res: Response) => {};

const loginUser = async (req: Request, res: Response) => {
	try {
		const schema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().min(8).required(),
		});

		const { error, value } = schema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const { email, password } = req.body;
		const user = await prisma.user.findUnique({
			where: { email },
		});
		// Check if the user with the given email exists
		if (!user) {
			return res.status(401).json({ error: 'Invalid email or password.' });
		}

		// Verify the password
		const passwordMatch = await bcrypt.compare(password, user.password); // Compare the hashed password
		if (!passwordMatch) {
			return res.status(401).json({ error: 'Invalid email or password.' });
		}

		const token: string = generateToken(user.id);
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
	} catch (error) {
		console.error('Error logging in:', error);
		res.status(500).json({ error: 'An error occurred while logging in.' });
	}
};

// Function to handle password reset request
const forgotPassword = async (req: Request, res: Response) => {
	const { email } = req.body;

	// Send a reset password email
	// const transporter = nodemailer.createTransport({});

	res.status(200).json({ message: 'Password reset email sent' });
};

// Function to handle password reset
const resetPassword = async (req: Request, res: Response) => {
	const { token, password } = req.body;
	res.status(200).json({ message: 'Password reset successfully' });
};

const logout = (req: Request, res: Response) => {
	// req.logout();
	res.status(200).json({});
};

// Twitter Authentication
const twitterAuth = (req: Request, res: Response) => {
	// start the twitter authentication flow
	passport.authenticate('twitter');
};

const twitterAuthCallback = (req: Request, res: Response) => {
	passport.authenticate('twitter', (err: any, user: any) => {
		if (err) {
			// Handle authentication errors
			return res.status(500).json({ error: 'Authentication error' });
		}
		if (!user) {
			// Authentication failed
			return res.status(401).json({ error: 'Authentication failed' });
		}

		// Authentication succeeded
		const accessToken = generateToken(user.id);
		res.status(200).json({ user, accessToken });
	})(req, res);
};

export {
	googleAuth,
	callback,
	registerUser,
	verifyEmail,
	loginUser,
	logout,
	forgotPassword,
	resetPassword,
	twitterAuth,
	twitterAuthCallback,
};
