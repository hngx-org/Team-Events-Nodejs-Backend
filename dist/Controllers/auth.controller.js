"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callback = exports.logout = exports.twitterAuth = exports.googleAuth = void 0;
const client_1 = require("@prisma/client");
const google_config_1 = require("../config/google.config");
const utils_1 = require("../utils");
const prisma = new client_1.PrismaClient();
const googleAuth = (req, res) => {
    res.redirect(google_config_1.authUrl);
};
exports.googleAuth = googleAuth;
const callback = async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = await google_config_1.oauth2Client.getToken(code);
        google_config_1.oauth2Client.setCredentials(tokens);
        const oauth2 = google_config_1.google.oauth2({ version: 'v2', auth: google_config_1.oauth2Client });
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
                },
            });
            //generate accessToken
            const token = (0, utils_1.generateToken)(newUser.id);
            //return token
            res.status(201).json({
                statusCode: 201,
                message: 'User created',
                data: {
                    id: newUser.id,
                    token,
                },
            });
        }
        else {
            //generate access token
            const token = (0, utils_1.generateToken)(userExists.id);
            //return token
            res.status(200).json({
                statusCode: 200,
                message: 'User created',
                data: {
                    id: userExists.id,
                    token,
                },
            });
        }
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(500).send('Authentication error');
    }
    finally {
        // Close the Prisma client at the end of the function
        prisma.$disconnect();
    }
};
exports.callback = callback;
const twitterAuth = (req, res) => { };
exports.twitterAuth = twitterAuth;
const logout = (req, res) => { };
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map