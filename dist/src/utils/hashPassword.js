"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashPassword = async (password) => {
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    return hashedPassword;
};
exports.hashPassword = hashPassword;
const verifyPassword = async (plainPassword, hashPassword) => {
    return await bcryptjs_1.default.compare(plainPassword, hashPassword);
};
exports.verifyPassword = verifyPassword;
//# sourceMappingURL=hashPassword.js.map