
const moment = require("moment");
const httpStatus = require("http-status");
const USER_MODEL = require("../user.model");
const ApiError = require("../../../utils/ApiError");

/**
 * Verify the OTP
 * @param {string} email
 * @param {string} otp
 * @returns {Promise<USER_MODEL>}
 */
const verifyOtp = async (email, otp) => {
	const user = await USER_MODEL.findOne({ email });

	if (!user) {
        return { message: "User not found", code: httpStatus.NOT_FOUND, status:false };
	}
	if (user.otp.code !== otp || moment().isAfter(user.otp.expires)) {
        return { message: "Invalid or expired OTP", code: httpStatus.BAD_REQUEST, status:false };
	}

	user.isEmailVerified = true;
	user.otp = { code: null, expires: null };
	await user.save();
    return { data: user, code: httpStatus.OK, status: true };

};

module.exports = verifyOtp;
