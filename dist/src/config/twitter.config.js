"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitterCallbackUrl = exports.twitterConsumerSecret = exports.twitterConsumerKey = void 0;
const client_1 = require("@prisma/client");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const prisma = new client_1.PrismaClient();
const twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
exports.twitterConsumerKey = twitterConsumerKey;
const twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
exports.twitterConsumerSecret = twitterConsumerSecret;
// const twitterAccessTokenKey = process.env.ACCESS_TOKEN_KEY;
// const twitterAccessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const twitterCallbackUrl = 'https://wetindeysup-api.onrender.com/api/auth/twitter/callback';
exports.twitterCallbackUrl = twitterCallbackUrl;
// const twitterCallbackUrl = 'http://localhost:8080/api/auth/twitter/callback';
const passport_1 = __importDefault(require("passport"));
const passport_twitter_1 = require("passport-twitter");
passport_1.default.use(new passport_twitter_1.Strategy({
    consumerKey: twitterConsumerKey,
    consumerSecret: twitterConsumerSecret,
    callbackURL: twitterCallbackUrl,
    userAuthorizationURL: 'https://api.twitter.com/oauth/authenticate',
    accessTokenURL: 'https://api.twitter.com/oauth/access_token',
    userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_entities=true&include_email=true',
    includeEmail: true,
    includeEntities: true,
    passReqToCallback: false,
}, (req, twitterAccessTokenSecret, profile, done) => {
    prisma.user
        .findFirst({
        where: {
            auth_id: profile.id,
        },
    })
        .then((user) => {
        if (user) {
            //user already exists, return the user
            return done(null, user);
        }
        else {
            //user does not exist create new user
            prisma.user
                .create({
                data: {
                    auth_method: 'twitter',
                    auth_id: profile.id,
                    username: profile.username,
                    email: profile.emails[0].value,
                },
            })
                .then((newUser) => {
                //return newly created user
                return done(null, newUser);
            })
                .catch((error) => {
                //handle any errors that occurs during user creation
                return done(error, false);
            });
        }
    })
        .catch((error) => {
        //handle error that occurs during database query
        return done(error, false);
    });
}));
//# sourceMappingURL=twitter.config.js.map