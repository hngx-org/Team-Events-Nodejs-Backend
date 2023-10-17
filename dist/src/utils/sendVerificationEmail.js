"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const mail_config_1 = __importDefault(require("../config/mail.config"));
const sendVerificationEmail = (email, token) => {
    // const verificationLink = `http://localhost:8080/api/auth/verify-email?token=${token}`;
    const verificationLink = `https://wetindeysup-api.onrender.com/api/auth/verify-email?token=${token}`;
    const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: email,
        subject: 'Email Verification',
        html: `<p>Click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
    };
    mail_config_1.default.sendMail(mailOptions, (error) => {
        if (error) {
            console.error('Error sending verification email:', error);
        }
    });
};
exports.sendVerificationEmail = sendVerificationEmail;
//# sourceMappingURL=sendVerificationEmail.js.map