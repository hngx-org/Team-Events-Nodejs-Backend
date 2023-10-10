"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const dotenv_1 = require("dotenv");
const client_1 = require("@prisma/client");
(0, dotenv_1.config)();
const prisma = new client_1.PrismaClient();
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
};
const passportConfig = (passport) => {
    passport.use(new passport_jwt_1.Strategy(opts, async (jwtPayload, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: jwtPayload,
                },
            });
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        }
        catch (error) {
            return done(error, false);
        }
    }));
};
//# sourceMappingURL=passport.config.js.map