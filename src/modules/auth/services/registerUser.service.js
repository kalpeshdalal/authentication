const moment = require("moment");
const httpStatus = require("http-status");
const USER_MODEL = require("../user.model");
const ApiError = require("../../../utils/ApiError");
const crypto = require("crypto");

/**
 * Register a new user
 * @param {Object} userBody
 * @returns {Promise<USER_MODEL>}
 */

const registerUser = async (userBody) => {
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

	const otpCode = generateOtp();
	user.otp = {
		code: otpCode,
		expires: moment().add(10, "minutes").toDate(),
	};
	await user.save();

    return { data: { email: user.email }, code: httpStatus.CREATED, status: true };

};

const generateOtp = () => {
	return crypto.randomInt(100000, 999999).toString();
};

module.exports = registerUser;
