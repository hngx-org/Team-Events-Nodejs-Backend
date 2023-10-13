"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.google = exports.authUrl = exports.oauth2Client = void 0;
const googleapis_1 = require("googleapis");
Object.defineProperty(exports, "google", { enumerable: true, get: function () { return googleapis_1.google; } });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const clientId = process.env['GOOGLE_CLIENT_ID'];
const clientSecret = process.env['GOOGLE_CLIENT_SECRET'];
const redirectUri = 'https://wetindeysup-api.onrender.com/api/auth/callback';
// const redirectUri = 'http://localhost:8080/api/auth/callback';
const oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectUri);
exports.oauth2Client = oauth2Client;
const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
];
const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
});
exports.authUrl = authUrl;
//# sourceMappingURL=google.config.js.map