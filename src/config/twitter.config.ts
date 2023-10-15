import { PrismaClient } from '@prisma/client';
import { error } from 'console';
import { config } from 'dotenv';
config();

const prisma = new PrismaClient();

const twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
const twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
// const twitterAccessTokenKey = process.env.ACCESS_TOKEN_KEY;
// const twitterAccessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const twitterCallbackUrl = 'https://wetindeysup-api.onrender.com/api/auth/twitter/callback';
// const twitterCallbackUrl = 'http://localhost:8080/api/auth/twitter/callback';

import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';

passport.use(
	new TwitterStrategy(
		{
			consumerKey: twitterConsumerKey,
			consumerSecret: twitterConsumerSecret,
			callbackURL: twitterCallbackUrl,
			userAuthorizationURL: 'https://api.twitter.com/oauth/authenticate',
			accessTokenURL: 'https://api.twitter.com/oauth/access_token',
			userProfileURL:
				'https://api.twitter.com/1.1/account/verify_credentials.json?include_entities=true&include_email=true',
			includeEmail: true,
			includeEntities: true,
			passReqToCallback: false,
		},
		(req, twitterAccessTokenSecret, profile, done) => {
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
					} else {
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
		}
	)
);

export { twitterConsumerKey, twitterConsumerSecret, twitterCallbackUrl };
