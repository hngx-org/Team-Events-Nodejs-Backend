"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPreference = exports.getUserPreference = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
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
//# sourceMappingURL=user.controller.js.map