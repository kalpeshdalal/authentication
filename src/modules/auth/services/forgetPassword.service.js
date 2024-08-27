const USER_MODEL = require("../user.model");
const crypto = require("crypto");
const moment = require("moment");
const httpStatus = require("http-status");
const tokenServices = require("../../token/services");
const { tokenTypes } = require("../../../config/tokenTypes");
const config = require("../../../config/config");

/**
 * Handle forget password logic
 * @param {string} email
 * @param {Object} req
 * @returns {Promise<Object>}
 */
const forgetPassword = async (email, req) => {
	const user = await USER_MODEL.findOne({ email });

	if (!user) {
		return { message: "User not found", code: httpStatus.NOT_FOUND, status: false };
	}

	if (!user.isEmailVerified) {
		return { message: "Email not verified", code: httpStatus.BAD_REQUEST, status: false };
	}

	if (user.isLocked) {
		return { message: "Account is locked", code: httpStatus.FORBIDDEN, status: false };
	}

	const now = moment();
	if (
		user.otp.lastRequest &&
		user.otp.requestCount >= 3 &&
		now.diff(user.otp.lastRequest, "hours") < 1
	) {
		return { message: "OTP request limit reached. Please try again later.", code: httpStatus.TOO_MANY_REQUESTS, status: false };
	}

	if (user.otp.lastRequest && now.diff(user.otp.lastRequest, "hours") >= 1) {
		user.otp.requestCount = 0;
	}

	const otpCode = generateOtp();
	user.otp.code = otpCode;
	user.otp.expires = now.add(10, "minutes").toDate();
	user.otp.requestCount += 1;
	user.otp.lastRequest = now.toDate();
	user.otp.ipAddress = req.ip;
	user.otp.userAgent = req.get("User-Agent");
	user.otp.otpType = 'forgetPassword';
	await user.save();

	const tokenExpires = moment().add(config.jwt.resetPasswordExpirationMinutes, "minutes");
	const token = await tokenServices.generateToken(user.email, tokenExpires, tokenTypes.RESET_PASSWORD);
    await tokenServices.saveToken(token, user._id, tokenExpires,  tokenTypes.RESET_PASSWORD );
	return { status: true, token };
};

/**
 * Generate a 6-digit OTP
 * @returns {string}
 */
const generateOtp = () => {
	return crypto.randomInt(100000, 999999).toString();
};

module.exports = forgetPassword;
