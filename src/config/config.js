// src/config/config.js

const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string()
			.valid("production", "development", "test")
			.required(),
		PORT: Joi.number().default(3000),
		MONGODB_URL: Joi.string().required().description("Mongo DB url"),
		JWT_SECRET: Joi.string().required().description("JWT secret key"),
		JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30),
		JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30),
		JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10),
		SESSION_SECRET: Joi.string()
			.required()
			.description("Session secret key"),
		SESSION_COOKIE_EXPIRATION: Joi.number()
			.default(30)
			.description("Session cookie expiration in days"),
	})
	.unknown();

const { value: envVars, error } = envVarsSchema
	.prefs({ errors: { label: "key" } })
	.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	mongoose: {
		url: envVars.MONGODB_URL,
		options: {
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	},
	jwt: {
		secret: envVars.JWT_SECRET,
		accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
		refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
		resetPasswordExpirationMinutes:
			envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
	},
	session: {
		secret: envVars.SESSION_SECRET,
		cookieExpiration: envVars.SESSION_COOKIE_EXPIRATION,
	},
};
