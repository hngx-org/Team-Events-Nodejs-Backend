"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            req.user = await prisma.user.findUnique({
                where: {
                    id: decoded.id,
                },
                select: {
                    id: true,
                    email: true,
                },
            });
            next();
        }
        catch (error) {
            console.error(error);
            res.status(401).json({
                status: 401,
                message: 'There was an issue authorizing token',
                data: null,
            });
        }
    }
    else {
        res.status(401).json({
            status: 401,
            message: 'Unauthorized',
            data: null,
        });
    }
};
exports.default = protect;
//# sourceMappingURL=auth.middleware.js.map