"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveOnboardingInfo = exports.getUserRegisteredEvents = exports.updateUserProfile = exports.changePassword = exports.updateUserPreference = exports.getUserPreference = void 0;
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
            allow_others_see_profile: joi_1.default.boolean().required(),
            event_details: joi_1.default.boolean().required(),
            anyone_can_add_to_group: joi_1.default.boolean().required(),
        });
        const { error, value } = requestSchema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        const userId = req.user.id;
        const isUserPreferenceExist = await prisma.userPreference.findFirst({
            where: {
                user_id: userId,
            },
        });
        let userPreference;
        if (!isUserPreferenceExist) {
            userPreference = await prisma.userPreference.create({
                data: {
                    user_id: userId,
                    event_update: value.event_updates,
                    Reminders: value.reminders,
                    networking_opportunities: value.networking_opportunities,
                    email_notifications: value.email_notifications,
                    push_notifications: value.push_notifications,
                    allow_others_see_profile: value.allow_others_see_profile,
                    event_details: value.event_details,
                    anyone_can_add_to_group: value.anyone_can_add_to_group,
                },
            });
        }
        else {
            userPreference = await prisma.userPreference.update({
                where: {
                    id: isUserPreferenceExist.id,
                },
                data: {
                    event_update: value.event_updates,
                    Reminders: value.reminders,
                    networking_opportunities: value.networking_opportunities,
                    email_notifications: value.email_notifications,
                    push_notifications: value.push_notifications,
                    allow_others_see_profile: value.allow_others_see_profile,
                    event_details: value.event_details,
                    anyone_can_add_to_group: value.anyone_can_add_to_group,
                },
            });
        }
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
            message: `Password successfully updated`,
            success: true,
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
            prefix: joi_1.default.string(),
            fullName: joi_1.default.string(),
            phoneNumber: joi_1.default.string(),
            avatar: joi_1.default.any(),
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
                prefix: value.prefix || user.prefix,
                username: value.fullName || user.username,
                phone_no: value.phoneNumber || user.phone_no,
                avatar: uploadedImage || user.avatar,
            },
        });
        res.status(200).json({
            message: `Profile updated successfully `,
            success: true,
            data: {
                id: updatedUser.id,
                email: updatedUser.email,
                prefix: updatedUser.prefix,
                username: updatedUser.username,
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
const saveOnboardingInfo = async (req, res) => {
    try {
        const email = req.user.email;
        const profileSchema = joi_1.default.object({
            tags: joi_1.default.array(),
            location: joi_1.default.string(),
        });
        const { error, value } = profileSchema.validate(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });
        if (!user)
            return res.status(400).json({ error: `User not found` });
        await prisma.user.update({
            where: { email: email },
            data: { interests: value.tags || user.interests, location: value.location || user.location },
        });
        res.status(200).json({
            message: `Onboarding info saved successfully.`,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: `internet error`, success: false });
    }
};
exports.saveOnboardingInfo = saveOnboardingInfo;
const getUserRegisteredEvents = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user)
            return res.status(400).json({ error: `User not found` });
        const userEvents = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                event: true,
            },
        });
        if (!userEvents) {
            return res.status(404).json({ error: 'User or Event not found' });
        }
        const userRegisteredEvents = userEvents.event;
        // Respond with the user's created events
        res.status(200).json({
            statusCode: 200,
            message: 'User events retrieved successfully',
            data: userRegisteredEvents,
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
exports.getUserRegisteredEvents = getUserRegisteredEvents;
//# sourceMappingURL=user.controller.js.map