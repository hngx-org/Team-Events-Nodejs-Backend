"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.changePassword = exports.updateUserPreference = exports.getUserPreference = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const hashPassword_1 = require("../utils/hashPassword");
const cloudinaryConfig_1 = __importDefault(require("../config/cloudinaryConfig"));
const prisma = new client_1.PrismaClient();
const getUserPreference = async (req, res) => {
    const userId = req.user.id;
    try {
        const userPreferences = await prisma.userPreference.findUnique({
            where: {
                id: userId,
            },
        });
        if (userPreferences) {
            res.status(200).json({ message: 'User preferences retrieved successfully', data: userPreferences });
        }
        else {
            res.status(404).json({ message: 'User preferences not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching user preferences' });
    }
};
exports.getUserPreference = getUserPreference;
const updateUserPreference = async (req, res) => {
    try {
        const requestSchema = joi_1.default.object({
            event_updates: joi_1.default.boolean().required(),
            reminders: joi_1.default.boolean().required(),
            networking_opportunities: joi_1.default.boolean().required(),
            email_notifications: joi_1.default.boolean().required(),
            push_notifications: joi_1.default.boolean().required(),
        });
        const { error, value } = requestSchema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        const userId = req.user.id;
        const userPreference = await prisma.userPreference.create({
            data: {
                user_id: userId,
                event_update: value.event_updates,
                Reminders: value.reminders,
                networking_opportunities: value.networking_opportunities,
                email_notifications: value.email_notifications,
                push_notifications: value.push_notifications,
            },
        });
        return res.status(200).json({ message: 'User preference saved successfully', data: userPreference });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while saving user preference' });
    }
};
exports.updateUserPreference = updateUserPreference;
const changePassword = async (req, res) => {
    try {
        const email = req.user.email;
        const passwordSchema = joi_1.default.object({
            currentPassword: joi_1.default.string().min(8).required(),
            newPassword: joi_1.default.string().min(8).required(),
            confirmNewPassword: joi_1.default.ref('newPassword'),
        }).with('newPassword', 'confirmNewPassword');
        const { error, value } = passwordSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(400).json({ error: `user not found`, success: false });
        }
        const isPasswordMatch = await (0, hashPassword_1.verifyPassword)(value.currentPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                error: `Current password is incorrect`,
                success: false,
            });
        }
        const hashedPassword = await (0, hashPassword_1.hashPassword)(value.newPassword);
        const updatedUser = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                password: hashedPassword,
            },
        });
        if (!updatedUser) {
            return res.status(400).json({
                status: `error`,
                message: `password failed to update`,
                success: false,
            });
        }
        res.status(200).json({
            status: `success`,
            message: `password successfully updated`,
            success: true,
            data: {
                id: updatedUser.id,
                email: updatedUser.email,
                username: updatedUser.username,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                avatar: updatedUser.avatar,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: `error`,
            message: `internet error`,
            success: false,
        });
    }
};
exports.changePassword = changePassword;
const updateUserProfile = async (req, res) => {
    try {
        const email = req.user.email;
        const profileSchema = joi_1.default.object({
            firstname: joi_1.default.string(),
            lastname: joi_1.default.string(),
            phonenumber: joi_1.default.string(),
        });
        const { error, value } = profileSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });
        if (!user)
            return res.status(400).json({ error: `User not found` });
        let uploadedImage = '';
        if (req.file) {
            // File upload (Cloudinary)
            const { secure_url } = await cloudinaryConfig_1.default.uploader.upload(req.file.path);
            uploadedImage = secure_url;
        }
        const updatedUser = await prisma.user.update({
            where: { email: email },
            data: {
                firstname: value.firstname,
                lastname: value.lastname,
                phone_no: value.phonenumber,
                avatar: uploadedImage,
            },
        });
        res.status(200).json({
            message: `Profile updated successfully `,
            success: true,
            data: {
                id: updatedUser.id,
                email: updatedUser.email,
                username: updatedUser.username,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                avatar: updatedUser.avatar,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: `internet error`,
            success: false,
        });
    }
};
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=user.controller.js.map