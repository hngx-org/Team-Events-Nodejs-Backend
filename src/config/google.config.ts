import { google } from 'googleapis';
import { config } from 'dotenv';
config();

const clientId = process.env['GOOGLE_CLIENT_ID'];
const clientSecret = process.env['GOOGLE_CLIENT_SECRET'];
// const redirectUri = 'https://wetindeysup-api.onrender.com/api/auth/callback';
// const redirectUri = 'http://localhost:8080/api/auth/callback';
const redirectUri = 'http://localhost:3000';

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

const scopes = [
	'https://www.googleapis.com/auth/userinfo.profile',
	'https://www.googleapis.com/auth/userinfo.email',
];

const authUrl = oauth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: scopes,
});

export { oauth2Client, authUrl, google };
