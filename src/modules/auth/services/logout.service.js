const httpStatus = require("http-status");
const TOKEN_MODEL = require("../../token/token.model");

const logout = async (refreshToken) => {
	try {
		const result = await TOKEN_MODEL.deleteOne({ token: refreshToken });
		if (result.deletedCount === 0) {
			return { message: "Token not found.", code: httpStatus.NOT_FOUND, status: false };
		}
		return { message: "Logout Successfully!", code: httpStatus.OK, status: true };

	} catch (error) {
		return { message: "An error occurred during logout.", code: httpStatus.INTERNAL_SERVER_ERROR, status: false, error: error.message };
	}
};

module.exports = logout;
