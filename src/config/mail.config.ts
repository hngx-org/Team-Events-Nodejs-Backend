import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: 2525,
	auth: {
		user: process.env.MAIL_USERNAME,
		pass: process.env.MAIL_PASSWORD,
	},
});

export default transporter;
