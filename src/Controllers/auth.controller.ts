import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { authUrl, oauth2Client, google } from '../config/google.config';
import { generateToken } from '../utils';
import passport from 'passport';

const prisma = new PrismaClient();

const googleAuth = (req: Request, res: Response) => {
	res.redirect(authUrl);
};

const callback = async (req: Request, res: Response) => {
	// const code = req.query.code as string;
	const { code } = req.body;

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
				message: 'User created successfully',
				data: {
					id: newUser.id,
					email: newUser.email,
					username: newUser.username,
					avatar: newUser.avatar,
					token,
				},
			});
		} else {
			// generate access token
			const token: string = generateToken(userExists.id);
			// return token
			res.status(200).json({
				statusCode: 200,
				message: 'User login successfully',
				data: {
					id: userExists.id,
					email: userExists.email,
					username: userExists.username,
					avatar: userExists.avatar,
					token,
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

const twitterAuth = (req: Request, res: Response) => {
	// start the twitter authentication flow
	passport.authenticate('twitter');
};

// controller function to handle the twitter callback
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

const logout = (req: Request, res: Response) => {
	// req.logout();
	res.status(200).json({});
};

export { googleAuth, twitterAuth, logout, callback, twitterAuthCallback };
