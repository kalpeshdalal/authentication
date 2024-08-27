const moment = require("moment");
const httpStatus = require("http-status");
const USER_MODEL = require("../user.model");
const crypto = require("crypto");

/**
 * Register a new user
 * @param {Object} userBody
 * @returns {Promise<USER_MODEL>}
 */

const registerUser = async (userBody, req) => {
	const isUser = await USER_MODEL.findOne({ email: userBody.email });
	if (isUser?.isEmailVerified) {
		return { message: "Email already taken", code: httpStatus.BAD_REQUEST, status:false };
	}
	let user;

	if (isUser && !isUser?.isEmailVerified) {
		user = isUser;
	} else {
		user = await USER_MODEL.create(userBody);
	}

	const now = moment();
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
	user.otp.userAgent = req.get('User-Agent'); 
	await user.save();

    return { data: { email: user.email }, code: httpStatus.CREATED, status: true };

};

const generateOtp = () => {
	return crypto.randomInt(100000, 999999).toString();
};

module.exports = registerUser;
