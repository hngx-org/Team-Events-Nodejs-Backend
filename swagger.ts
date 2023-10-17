// Define the Swagger document in JavaScript format
const swaggerDocument = {
	openapi: '3.0.0',
	info: {
		title: 'Team Events API (NodeJs)',
		version: '1.0.0',
		description: 'https://wetindeysup-api.onrender.com',
	},
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
		},
	},
	security: [
		{
			bearerAuth: [] as any,
		},
	],
	paths: {
		'/api/auth/google': {
			get: {
				tags: ['Auth'],
				summary: 'Authenticate with Google',
				description: 'This route is used to initiate Google OAuth authentication.',
				responses: {
					302: {
						description: 'Redirects to Google OAuth for authentication.',
					},
				},
			},
		},
		'/api/auth/callback': {
			get: {
				tags: ['Auth'],
				summary: 'Google OAuth Callback',
				description: 'This route handles the callback after Google OAuth authentication.',
				responses: {
					201: {
						description: 'User created and authenticated successfully.',
					},
					200: {
						description: 'User authenticated successfully.',
					},
					500: {
						description: 'Authentication error.',
					},
				},
			},
		},

		// '/api/auth/twitter': {
		// 	post: {
		// 		tags: ['Auth'],
		// 		summary: 'Authenticate with Twitter',
		// 		description: 'This route is used to initiate Twitter authentication.',
		// 		responses: {
		// 			302: {
		// 				description: 'Redirects to Twitter for authentication.',
		// 			},
		// 		},
		// 	},
		// },
		// '/api/auth/twitter/callback': {
		// 	post: {
		// 		tags: ['Auth'],
		// 		summary: 'Twitter Authentication Callback',
		// 		description: 'This route handles the callback after Twitter authentication.',
		// 		responses: {
		// 			200: {
		// 				description: 'User authenticated successfully.',
		// 			},
		// 			401: {
		// 				description: 'Authentication failed.',
		// 			},
		// 			500: {
		// 				description: 'Authentication error.',
		// 			},
		// 		},
		// 	},
		// },

		'/api/auth/signup': {
			post: {
				tags: ['Auth'],
				summary: 'Signup',
				description: 'This route is used to signup',
				paramaters: [
					{
						name: 'Email',
						in: 'body',
						required: true,
						type: 'email',
						description: "This is the user's email address",
					},

					{
						name: 'Password',
						in: 'body',
						required: true,
						type: 'string',
						description: "This is the user's password",
					},
				],

				responses: {
					201: {
						description: 'User registered successfully.',
					},

					409: {
						description: 'Email is already in use',
					},

					400: {
						description: "Bad request, please check that you're sending the right data",
					},

					500: {
						description: 'An error occurred during registration',
					},
				},
			},
		},

		'/api/auth/login': {
			post: {
				tags: ['Auth'],
				summary: 'Login',
				description: 'This route is used to login',
				paramaters: [
					{
						name: 'Email',
						in: 'body',
						required: true,
						type: 'email',
						description: "This is the user's email address",
					},

					{
						name: 'Password',
						in: 'body',
						required: true,
						type: 'string',
						description: "This is the user's password",
					},
				],

				responses: {
					200: {
						description: 'Login successful.',
					},

					401: {
						description: 'Invalid email or password',
					},

					500: {
						description: 'An error occurred while logging in',
					},
				},
			},
		},

		'/api/auth/forget-password': {
			post: {
				tags: ['Auth'],
				summary: 'Forget password',
				description: "This route is used to send a password reset link to the user's email address.",
				parameters: [
					{
						name: 'email',
						in: 'body',
						required: true,
						type: 'email',
						description: "This is the user's email address that the link would be sent to.",
					},

					{
						name: 'appBaseUrl',
						in: 'body',
						required: true,
						type: 'string',
						description: `This is the base URL that points to where you want to verify the email on the frontend something like https://wetin-dey-sup.vercel.app/auth/verfiy-email this is crucial because that's part of the link that would be sent to the user's email
						sending that would send this to the user's email as the link https://wetin-dey-sup.vercel.app/auth/verfiy-email?token={randomtoken}
						`,
					},
				],
				responses: {
					200: {
						description: "Password reset email sent successfully'",
					},

					404: {
						description: 'User not found',
					},

					500: {
						description: "An error occured while trying to process forget password request!'",
					},
				},
			},
		},

		'/api/auth/logout': {
			post: {
				tags: ['Auth'],
				summary: 'Logout',
				description: 'This route is used to log out the user.',
				responses: {
					302: {
						description: 'Redirects to the homepage after logging out.',
					},
				},
			},
		},

		'/api/events': {
			post: {
				tags: ['Event'],
				summary: 'Create Event',
				description: 'This route is used to create an event.',
				responses: {
					201: {
						description: 'Event created successfully.',
					},
					500: {
						description: 'Event creation error.',
					},
				},
			},
			get: {
				tags: ['Event'],
				summary: 'Get All Events',
				description: 'This route is used to get all events created by all users.',
				responses: {
					200: {
						description: 'Events retrieved successfully.',
					},
					404: {
						description: 'No events found.',
					},
				},
			},
		},
		'/api/events/friends': {
			get: {
				tags: ['Event'],
				summary: 'Get Friend Events',
				description: 'This route is used to get all events of members of shared groups.',
				responses: {
					200: {
						description: 'Friend events retrieved successfully.',
					},
					404: {
						description: 'No friend events found.',
					},
				},
			},
		},
		'/api/events/calendar': {
			get: {
				tags: ['Event'],
				summary: 'Get All Events (calendar)',
				description: 'This route is used to get all events',
				responses: {
					200: {
						description: 'Events retrieved successfully.',
					},
					404: {
						description: 'No events found.',
					},
				},
			},
		},
		'/api/events/search': {
			get: {
				tags: ['Event'],
				summary: 'Search Events',
				description: 'This route is used to search for events by name.',
				parameters: [
					{
						name: 'keyword',
						in: 'query',
						required: true,
						type: 'string',
					},
				],
				responses: {
					200: {
						description: 'Events matching the search retrieved successfully.',
					},
					404: {
						description: 'No matching events found.',
					},
				},
			},
		},
		'/api/events/info/{eventId}': {
			get: {
				tags: ['Event'],
				summary: 'Get Event by ID',
				description: 'This route is used to get a particular event by its ID.',
				parameters: [
					{
						name: 'eventId',
						in: 'path',
						required: true,
						type: 'string',
					},
				],
				responses: {
					200: {
						description: 'Event retrieved successfully.',
					},
					404: {
						description: 'Specified event does not exist.',
					},
				},
			},
		},
		'/api/events/{eventId}': {
			put: {
				tags: ['Event'],
				summary: 'Update Event',
				description: 'This route is used to update an event.',
				parameters: [
					{
						name: 'eventId',
						in: 'path',
						required: true,
						type: 'string',
					},
				],
				responses: {
					201: {
						description: 'Event updated successfully.',
					},
					500: {
						description: 'Error updating event.',
					},
				},
			},
			delete: {
				tags: ['Event'],
				summary: 'Delete Event',
				description: 'This route is used to delete a particular event.',
				parameters: [
					{
						name: 'eventId',
						in: 'path',
						required: true,
						type: 'string',
					},
				],
				responses: {
					200: {
						description: 'Event deleted successfully.',
					},
					404: {
						description: 'Event not found.',
					},
				},
			},
		},

		'/api/comments/{eventId}': {
			post: {
				tags: ['Comment'],
				summary: 'Create Comment',
				description: 'This route is used to create a comment.',
				parameters: [
					{
						name: 'eventId',
						in: 'path',
						required: true,
						type: 'string',
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									comment: {
										type: 'string',
									},
								},
							},
							example: {
								comment: 'Nice. I will be there.',
							},
						},
					},
				},
				responses: {
					201: {
						description: 'Comment created successfully.',
					},
					500: {
						description: 'Error creating comment.',
					},
				},
			},
			get: {
				tags: ['Comment'],
				summary: 'Get Comments',
				description: 'This route is used to get comments.',
				parameters: [
					{
						name: 'eventId',
						in: 'path',
						required: true,
						type: 'string',
					},
				],
				responses: {
					201: {
						description: 'Comments retrieved successfully.',
					},
					404: {
						description: 'No comments found for this event.',
					},
				},
			},
		},

		'/api/groups': {
			post: {
				tags: ['Groups'],
				summary: 'Create Group',
				description:
					'This route is used to create groups (no page on the design for this, but just use the information in the table)',
				responses: {
					201: {
						description: 'Group created successfully.',
					},
					500: {
						description: 'Group creation error.',
					},
				},
			},
			get: {
				tags: ['Groups'],
				summary: 'Get User Groups',
				description: 'This route is used to get all groups that a user is a part of.',
				responses: {
					200: {
						description: 'User group fetched successfully.',
					},
					404: {
						description: 'User not found.',
					},
				},
			},
		},
		'/api/groups/{groupId}/addUser': {
			post: {
				tags: ['Groups'],
				summary: 'Add user to group',
				description: 'This route is used add a user to a group using the user email address.',
				parameters: [
					{
						name: 'groupId',
						in: 'path',
						required: true,
						type: 'string',
					},
				],
				responses: {
					201: {
						description: 'User added successfully.',
					},
					500: {
						description: 'Error adding user.',
					},
				},
			},
		},
		'/api/groups/info/{groupId}': {
			get: {
				tags: ['Groups'],
				summary: 'Get Group by ID',
				description: 'This route is used to get a particular group by its ID.',
				parameters: [
					{
						name: 'groupId',
						in: 'path',
						required: true,
						type: 'string',
					},
				],
				responses: {
					200: {
						description: 'Group retrieved successfully.',
					},
					404: {
						description: 'Group not found.',
					},
				},
			},
		},
		'/api/groups/events/{groupId}': {
			get: {
				tags: ['Groups'],
				summary: 'Get Events in Group',
				description: 'This route is used to get all events under a specific group.',
				parameters: [
					{
						name: 'groupId',
						in: 'path',
						required: true,
						type: 'string',
					},
				],
				responses: {
					200: {
						description: 'Events retrieved successfully.',
					},
					404: {
						description: 'No events found for this group.',
					},
				},
			},
		},

		'/api/user/settings': {
			get: {
				tags: ['User Settings'],
				summary: 'Get User Preferences Settings',
				description: 'This route is used to get a particular user preferences settings',
				responses: {
					200: {
						description: 'User preferences retrieved successfully.',
					},
					404: {
						description: 'User preferences not found.',
					},
					500: {
						description: 'An error occurred while fetching user preferences',
					},
				},
			},

			post: {
				tag: ['Update User Settings'],
				summary: 'Update The User Preferences Settings',
				description: 'This route is used to update a particular user preference',
				responses: {
					200: {
						description: 'User preference saved successfully',
					},

					500: {
						description: 'An error occurred while saving user preference',
					},
				},
			},
		},
	},
};

export default swaggerDocument;
