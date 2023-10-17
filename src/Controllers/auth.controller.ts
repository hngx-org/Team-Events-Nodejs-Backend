import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import transporter from './../config/mail.config';
import { Request, Response } from 'express';
import Joi from 'joi';
import passport from 'passport';
import { authUrl, google, oauth2Client } from '../config/google.config';
import { generateToken } from '../utils';

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
	// const { email, password } = req.body;
};

const verifyEmail = (req: Request, res: Response) => {
	// req.logout();
	res.status(200).json({});
};

const loginUser = async (req: Request, res: Response) => {
	// const { email, password } = req.body;
};

// Function to handle password reset request
const forgotPassword = async (req: Request, res: Response) => {
	try {
		const requestSchema = Joi.object({
			email: Joi.string().required().email(),
			appBaseUrl: Joi.string().required(),
		});

		/*

		appBaseUrl should be the url from the frontend.
		something like http://wetin-dey-sup.vercel.app/auth/token

		*/

		const { error, value } = requestSchema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });

		const { email, appBaseUrl } = value;

		//check if a user with this email exist
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const salt = await bcrypt.genSalt(10);
		const resetToken = await bcrypt.hash(user.id, salt);
		const tokenExpireDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

		// Save the reset token and expiration date in the user's record
		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				reset_password_token: resetToken,
				reset_password_expires: tokenExpireDate,
			},
		});

		const resetLink = `${appBaseUrl}?token=${resetToken}`;
		const mailOptions = {
			from: process.env.MAIL_FROM_ADDRESS,
			to: email,
			subject: 'Password Reset',
			text: `Click on the following link to reset your password: ${resetLink}`,
		};
		await transporter.sendMail(mailOptions);

		return res.status(200).json({ message: 'Password reset email sent successfully' });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ error: 'An error occured while trying to process forget password request!' });
	}
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
	callback,
	forgotPassword,
	googleAuth,
	loginUser,
	logout,
	registerUser,
	resetPassword,
	twitterAuth,
	twitterAuthCallback,
	verifyEmail,
};
