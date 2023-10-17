import transporter from '../config/mail.config';

export const sendVerificationEmail = (email: string, token: string) => {
	const verificationLink = `http://localhost:8080/api/auth/verify-email?token=${token}`;
	const mailOptions = {
		from: process.env.MAIL_FROM_ADDRESS,
		to: email,
		subject: 'Email Verification',
		html: `<p>Click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
	};
	transporter.sendMail(mailOptions, (error) => {
		if (error) {
			console.error('Error sending verification email:', error);
		}
	});
};
