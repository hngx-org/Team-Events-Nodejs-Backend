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
				summary: 'Handle user registration',
				description: 'Register a new user.',
				requestBody: {
					content: {
						'application/json': {
							example: {
								name: 'test user',
								email: 'testuser1@example.com',
								password: 'mysecretpassword',
							},
						},
					},
					required: true,
				},
				responses: {
					'200': {
						description: 'Sign up successful. A verification link has been sent to your email.',
					},
					'400': {
						description: 'Registration failed.',
					},
				},
			},
		},
		'/api/auth/login': {
			post: {
				tags: ['Auth'],
				summary: 'Handle user login',
				description: 'Log in an existing user.',
				requestBody: {
					content: {
						'application/json': {
							example: {
								email: 'user@example.com',
								password: 'mysecretpassword',
							},
						},
					},
					required: true,
				},
				responses: {
					'200': {
						description: 'User logged in successfully.',
					},
					'400': {
						description: 'Login failed.',
					},
				},
			},
		},
		'/api/auth/verify-email': {
			get: {
				tags: ['Auth'],
				summary: 'Handle email verification after user registration',
				description: 'The link sent to the user email which verify the email.',
				parameters: [
					{
						name: 'token',
						in: 'query',
						required: true,
						type: 'string',
					},
				],
				responses: {
					'200': {
						description:
							'Redirects to the frontend with query; email_verified=true. e.g., http://localhost:3000/dashboard/?email_verified=true',
					},
					'400': {
						description:
							'Redirects to the frontend with query; email_verified=false. e.g., http://localhost:3000/dashboard/?email_verified=false',
					},
				},
			},
		},
		'/api/auth/forgot-password': {
			post: {
				tags: ['Auth'],
				summary: 'Request a password reset',
				description: 'Request a password reset for the user.',
				requestBody: {
					content: {
						'application/json': {
							example: {
								email: 'user@example.com',
								resetUrl: 'https: //example.com/reset',
							},
						},
					},
					required: true,
				},
				responses: {
					'200': {
						description: 'Password reset email sent successfully.',
					},
					'400': {
						description: 'Password reset request failed.',
					},
				},
			},
		},
		'/api/auth/reset-password': {
			post: {
				tags: ['Auth'],
				summary: 'Handle the password reset',
				description: "Reset the user's password.",
				requestBody: {
					content: {
						'application/json': {
							example: {
								resetToken: 'your-reset-token',
								password: 'yournewpassword',
							},
						},
					},
					required: true,
				},
				responses: {
					'200': {
						description: 'Password reset successful.',
					},
					'400': {
						description: 'Password reset failed.',
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
				description: 'Create a new event with optional image upload.',
				requestBody: {
					content: {
						'multipart/form-data': {
							schema: {
								type: 'object',
								properties: {
									name: { type: 'string' },
									description: { type: 'string' },
									startDate: { type: 'string', format: 'date-time' },
									startTime: { type: 'string' },
									endDate: { type: 'string', format: 'date-time' },
									endTime: { type: 'string' },
									location: { type: 'string' },
									tags: { type: 'array', items: { type: 'string' } },
									isPaidEvent: { type: 'boolean' },
									eventLink: { type: 'string' },
									ticketPrice: { type: 'number' },
									numberOfAvailableTickets: { type: 'integer' },
									registrationClosingDate: { type: 'string', format: 'date-time' },
									// Add an image field here if needed
								},
							},
						},
					},
				},
				responses: {
					201: {
						description: 'Event created successfully.',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										statusCode: { type: 'integer', example: 201 },
										message: { type: 'string', example: 'Event created successfully' },
										data: {
											type: 'object',
											properties: {
												// Define the structure of the returned event object
												id: { type: 'string' },
												name: { type: 'string' },
												description: { type: 'string' },
												// Include other event properties here
											},
										},
									},
								},
							},
						},
					},
					400: {
						description: 'Bad Request - Validation error.',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										error: { type: 'string' },
									},
								},
							},
						},
					},
					500: {
						description: 'Internal Server Error - Event creation error.',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										error: { type: 'string' },
									},
								},
							},
						},
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

			put: {
				tags: ['Event'],
				summary: 'Update A Particular Event',
				description:
					'This endpoint updates a particular event, note that the request body data is not compulaosry, you only send what you want to update.',
				requestBody: {
					content: {
						'multipart/form-data': {
							schema: {
								type: 'object',
								properties: {
									name: { type: 'string' },
									description: { type: 'string' },
									startDate: { type: 'string', format: 'date-time' },
									startTime: { type: 'string' },
									endDate: { type: 'string', format: 'date-time' },
									endTime: { type: 'string' },
									location: { type: 'string' },
									tags: { type: 'array', items: { type: 'string' } },
									isPaidEvent: { type: 'boolean' },
									eventLink: { type: 'string' },
									ticketPrice: { type: 'number' },
									numberOfAvailableTickets: { type: 'integer' },
									registrationClosingDate: { type: 'string', format: 'date-time' },
									// Add an image field here if needed
								},
							},
						},
					},
				},

				responses: {
					200: {
						description: 'Event updated successfully.',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										statusCode: { type: 'integer', example: 201 },
										message: { type: 'string', example: 'Event created successfully' },
										data: {
											type: 'object',
											properties: {
												// Define the structure of the returned event object
												id: { type: 'string' },
												name: { type: 'string' },
												description: { type: 'string' },
												// Include other event properties here
											},
										},
									},
								},
							},
						},
					},
					400: {
						description: 'Bad Request - Validation error.',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										error: { type: 'string' },
									},
								},
							},
						},
					},
					500: {
						description: 'Internal Server Error - Event update error.',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										error: { type: 'string' },
									},
								},
							},
						},
					},
				},
			},
		},

		'/api/events/upcoming': {
			get: {
				tags: ['Event'],
				summary: 'Get upcoming Events',
				// description: 'This route is used to get all events of members of shared groups.',
				parameters: [
					{
						name: 'limit',
						in: 'query',
						required: false,
						type: 'string',
					},
				],
				responses: {
					200: {
						description: 'Friend events retrieved successfully.',
					},
				},
			},
		},
		'/api/events/register/{eventId}': {
			post: {
				tags: ['Event'],
				summary: 'Register a user for an event',
				description: 'Allows a user to register for a specific event.',
				parameters: [
					{
						name: 'eventId',
						in: 'path',
						required: true,
						description: 'The unique identifier of the event.',
						schema: {
							type: 'string',
						},
					},
				],
				requestBody: {
					content: {
						'application/json': {
							example: {
								numberOfTickets: 1,
							},
						},
					},
					required: true,
				},
				responses: {
					201: {
						description: 'User registered for the event successfully.',
						content: {
							'application/json': {
								example: {
									statusCode: 201,
									message: 'User registered for the event successfully',
									registration: {
										id: 'a381ac82-7ce1-4aa7-a7b1-96d8e7a4b2cd',
										userId: 'e92faa95-0843-4c3c-b5af-597d83da0b3f',
										eventId: 'd9b6e600-5569-44f9-a6f2-51c32a8ea2a7',
										createdAt: '2023-10-11T16:25:33.516Z',
										updatedAt: '2023-10-11T16:25:33.516Z',
									},
								},
							},
						},
					},
					400: {
						description: 'Bad request. User is already registered for the event.',
					},
					404: {
						description: 'Event not found.',
					},
					500: {
						description: 'Internal server error.',
					},
				},
			},
		},
		'/api/events/unregister/{eventId}': {
			post: {
				tags: ['Event'],
				summary: 'Cancel User registration to an event',
				// description: 'Cancel User registration to an event.',
				parameters: [
					{
						name: 'eventId',
						in: 'path',
						required: true,
						description: 'The unique identifier of the event.',
						schema: {
							type: 'string',
						},
					},
				],
				responses: {
					201: {
						description: 'Your event registration has been successfully canceled.',
					},
					404: {
						description: 'Event not found.',
					},
					500: {
						description: 'Internal server error.',
					},
				},
			},
		},
		'/api/events/filter': {
			get: {
				tags: ['Event'],
				summary: 'Filter Events',
				description: 'Filter events based on location, event pricing, date, and event type.',
				parameters: [
					{
						name: 'location',
						in: 'query',
						description: 'Location to filter events by.',
						required: false,
						schema: {
							type: 'string',
						},
					},
					{
						name: 'eventPricing',
						in: 'query',
						description: 'Pricing type to filter events by.',
						required: false,
						schema: {
							type: 'string',
						},
					},
					{
						name: 'date',
						in: 'query',
						description: 'Date to filter events by (e.g., YYYY-MM-DD).',
						required: false,
						schema: {
							type: 'string',
						},
					},
					{
						name: 'eventType',
						in: 'query',
						description: 'Event type to filter events by.',
						required: false,
						schema: {
							type: 'string',
						},
					},
				],
				responses: {
					200: {
						description: 'Filtered events fetched successfully',
					},
					500: {
						description: 'Internal server error.',
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

		'/api/events/{eventId}': {
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

		'/api/user/settings': {
			get: {
				tags: ['User'],
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
				tags: ['User'],
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
