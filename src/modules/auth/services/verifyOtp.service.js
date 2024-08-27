
const moment = require("moment");
const httpStatus = require("http-status");
const USER_MODEL = require("../user.model");

/**
 * Verify the OTP
 * @param {string} email
 * @param {string} otp
 * @returns {Promise<USER_MODEL>}
 */
const verifyOtp = async (email, otp, req) => {
	const user = await USER_MODEL.findOne({ email });

	if (!user) {
        return { message: "User not found", code: httpStatus.NOT_FOUND, status:false };
	}
	if (user.otp.code !== otp || moment().isAfter(user.otp.expires)) {
        return { message: "Invalid or expired OTP", code: httpStatus.BAD_REQUEST, status:false };
	}
	if (user.otp.ipAddress !== req.ip || user.otp.userAgent !== req.get('User-Agent')) {
        return { message: "OTP verification failed due to IP or device mismatch", code: httpStatus.UNAUTHORIZED, status: false };
    }
	if (user.otp.otpType  !== "signupEmailVerify") {
        return { message: "OTP verification failed, Please Request New OTP.", code: httpStatus.UNAUTHORIZED, status: false };
    }
	user.isEmailVerified = true;
    user.otp = { code: null, expires: null, requestCount: 0, lastRequest: null, ipAddress: null, userAgent: null, otpType : null };
	await user.save();
    return { data: user, code: httpStatus.OK, status: true };

};

module.exports = verifyOtp;
