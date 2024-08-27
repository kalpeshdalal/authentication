const USER_MODEL = require("../user.model");
const tokenServices = require("../../token/services");
const { tokenTypes } = require("../../../config/tokenTypes");
const httpStatus = require("http-status");
const moment = require("moment");
const mongoose  = require("mongoose");

/**
 * Verify Forget Password OTP
 * @param {string} token - The token received from the user
 * @param {string} otp - The OTP entered by the user
 * @param {Object} req - The request object
 * @returns {Promise<Object>}
 */
const verifyForgetPasswordOtp = async (token, otp, req) => {
	try {
		const tokenDoc = await tokenServices.verifyToken(token, tokenTypes.RESET_PASSWORD);
		const user = await USER_MODEL.findOne({ _id: mongoose.Types.ObjectId(tokenDoc.user) });

		if (!user) {
			return { message: "User not found", code: httpStatus.NOT_FOUND, status: false };
		}

		if (moment().isAfter(user.otp.expires)) {
			return { message: "OTP has expired", code: httpStatus.UNAUTHORIZED, status: false };
		}
        if (user.otp.code !== otp ) {
            return { message: "Invalid OTP", code: httpStatus.BAD_REQUEST, status:false };
        }

        if (user.otp.ipAddress !== req.ip || user.otp.userAgent !== req.get('User-Agent')) {
            return { message: "OTP verification failed due to IP or device mismatch", code: httpStatus.UNAUTHORIZED, status: false };
        }
        user.isForgetPasswordOTPVerified = true;
        user.otp = { code: null, expires: null, requestCount: 0, lastRequest: null, ipAddress: null, userAgent: null , otpType : null };

		await user.save();

		return { status: true, data: {email : user.email, token: token} };
	} catch (error) {
		return { message: error.message, code: httpStatus.UNAUTHORIZED, status: false };
	}
};

module.exports = verifyForgetPasswordOtp;
