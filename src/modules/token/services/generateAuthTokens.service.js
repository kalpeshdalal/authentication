const moment = require("moment");
const { tokenTypes } = require("../../../config/tokenTypes");
const tokenServices = require("../../token/services");
const config = require("../../../config/config");

/**
 * Generate authentication tokens
 * @param {user} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
	const accessTokenExpires = moment().add(config?.jwt?.accessExpirationMinutes, "minutes");
	const accessToken = await tokenServices.generateToken(
		user.id,
		accessTokenExpires,
		tokenTypes.ACCESS
	);

	const refreshTokenExpires = moment().add(config?.jwt?.refreshExpirationDays, "days");
	const refreshToken = await tokenServices.generateToken(
		user.id,
		refreshTokenExpires,
		tokenTypes.REFRESH
	);
	await tokenServices.saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH,false);


	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires,
		},
		refresh: {
			token: refreshToken,
			expires: refreshTokenExpires,
		},
	};
};


module.exports = generateAuthTokens;
