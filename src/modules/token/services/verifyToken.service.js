
const TOKEN_MODEL = require("../token.model");


/**
 * Verify a token
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
	const tokenDoc = await TOKEN_MODEL.findOne({ token, type, blacklisted: false });
	if (!tokenDoc || tokenDoc.isExpired()) {
		throw new Error("Token is invalid or has expired");
	}
	return tokenDoc;
};

module.exports = verifyToken;
