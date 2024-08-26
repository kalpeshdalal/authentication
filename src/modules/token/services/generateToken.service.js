// src/modules/token/services/token.service.js

const config = require("../../../config/config");
const TOKEN_MODEL = require("../token.model");
const jwt = require("jsonwebtoken");
const moment = require("moment");

/**
 * Generate a token and save it in the database
 * @param {ObjectId} userId - The user ID
 * @param {Date} expires - The expiration date of the token
 * @param {string} type - The type of the token
 * @param {boolean} [blacklisted=false] - Whether the token is blacklisted
 * @returns {Promise<token>}
 */
const generateToken = async (
	userId,
	expires,
	type,
	secret = config.jwt.secret
) => {
	const payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix(),
		type,
	};
	return jwt.sign(payload, secret);
};

module.exports = generateToken;
