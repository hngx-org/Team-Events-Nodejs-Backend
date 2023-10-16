"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPreference = exports.getUserPreference = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUserPreference = (req, res) => {
    res.status(200).json({ message: 'Still in development' });
};
exports.getUserPreference = getUserPreference;
const updateUserPreference = (req, res) => {
    res.status(200).json({ message: 'Still in development' });
};
exports.updateUserPreference = updateUserPreference;
//# sourceMappingURL=user.controller.js.map