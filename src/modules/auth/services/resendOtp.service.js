const moment = require("moment");
const httpStatus = require("http-status");
const USER_MODEL = require("../user.model");
const crypto = require("crypto");

/**
 * Resend OTP to the user
 * @param {String} email
 * @returns {Promise<Object>}
 */

const resendOtp = async (email, req) => {
	const user = await USER_MODEL.findOne({ email });

	if (!user) {
		return { message: "User not found", code: httpStatus.NOT_FOUND, status: false };
	}

	if (user.isEmailVerified) {
		return { message: "Email is already verified", code: httpStatus.BAD_REQUEST, status: false };
	}

	const now = moment();

	if (user.otp && now.isBefore(moment(user.otp.expires))) {
		return { message: "OTP is still valid. Please wait for the current OTP to expire.", code: httpStatus.BAD_REQUEST, status: false };
	}

    if (user.otp.lastRequest && user.otp.requestCount >= 3 && now.diff(user.otp.lastRequest, 'hours') < 1) {
        return { message: "OTP request limit reached. Please try again later.", code: httpStatus.TOO_MANY_REQUESTS, status: false };
    }

    if (user.otp.lastRequest && now.diff(user.otp.lastRequest, 'hours') >= 1) {
        user.otp.requestCount = 0;
    }

	const otpCode = generateOtp();
	user.otp.code = otpCode;
	user.otp.expires = now.add(10, "minutes").toDate();
    user.otp.requestCount += 1;
    user.otp.lastRequest = now.toDate();
	user.otp.ipAddress = req.ip; 
    user.otp.userAgent = req.get('User-Agent'); 
	await user.save();


	return { data: { email: user.email }, code: httpStatus.OK, status: true, message: "OTP resent successfully" };
};

const generateOtp = () => {
	return crypto.randomInt(100000, 999999).toString();
};

module.exports = resendOtp;
