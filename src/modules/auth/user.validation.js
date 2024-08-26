// src/modules/auth/user.validation.js

const Joi = require("joi");
const { password, objectId } = require("../../utils/custom.validation");

const signup = {
	body: Joi.object().keys({
		email: Joi.string().required().email().messages({
			"string.email": "Please provide a valid email address",
			"any.required": "Email is required",
		}),
		password: Joi.string().required().custom(password).messages({
			"any.required": "Password is required",
			"string.base": "Password must be a string",
		}),
		name: Joi.string().required().messages({
			"any.required": "Name is required",
		}),
		role: Joi.string()
            .optional()
            .allow("", null)
			.valid("user", "admin", "superAdmin")
			.default("user")
			.messages({
				"any.only":
					'Role must be either "user", "admin", or "superAdmin"',
			}),
	}),
};

const login = {
	body: Joi.object().keys({
		email: Joi.string().required().email().messages({
			"string.email": "Please provide a valid email address",
			"any.required": "Email is required",
		}),
		password: Joi.string().required().messages({
			"any.required": "Password is required",
		}),
	}),
};

const otpVerification = {
	body: Joi.object().keys({
		email: Joi.string().required().email().messages({
			"string.email": "Please provide a valid email address",
			"any.required": "Email is required",
		}),
		otp: Joi.string().length(6).required().messages({
			"string.length": "OTP must be exactly 6 characters long",
			"any.required": "OTP is required",
		}),
	}),
};


module.exports = {
	signup,
	login,
	otpVerification,
};
