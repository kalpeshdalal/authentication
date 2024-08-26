// src/config/swagger.js
const config = require("./config");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerDefinition = {
	openapi: "3.0.0",
	info: {
		title: "KD's API documentation",
		version: "1.0.0",
		description:
			"This is the KD's API documentation for the Express project",
		contact: {
			name: "KD Support",
			url: `http://localhost:${config.port}`,
			email: "support@kdapi.com",
		},
		license: {
			name: "MIT",
			url: "https://opensource.org/licenses/MIT",
		},
	},
	servers: [
		{
			url: `http://localhost:${config.port}/v1`,
			description: "Development server",
		},
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
		},
		schemas: {
			User: {
				type: "object",
				properties: {
					id: {
						type: "string",
						example: "603e9f9b2929b2a7f8b3d84e",
					},
					name: {
						type: "string",
						example: "John Doe",
					},
					email: {
						type: "string",
						example: "user@example.com",
					},
					role: {
						type: "string",
						example: "user",
					},
					isEmailVerified: {
						type: "boolean",
						example: true,
					},
				},
			},
			Tokens: {
				// Define the Tokens schema here
				type: "object",
				properties: {
					access: {
						type: "object",
						properties: {
							token: {
								type: "string",
								example:
									"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
							},
							expires: {
								type: "string",
								example: "2022-03-29T23:30:00.000Z",
							},
						},
					},
					refresh: {
						type: "object",
						properties: {
							token: {
								type: "string",
								example:
									"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
							},
							expires: {
								type: "string",
								example: "2022-04-28T23:30:00.000Z",
							},
						},
					},
				},
			},
		},
	},
	security: [
		{
			bearerAuth: [],
		},
	],
};

const options = {
	swaggerDefinition,
	apis: ["./src/routes/v1/*.js", "./src/modules/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
