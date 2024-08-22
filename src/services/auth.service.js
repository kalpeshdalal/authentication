const httpStatus = require("http-status");
const tokenService = require("./token.service");
const Token = require("../models/token.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");
const mongoose = require("mongoose");
const moment = require("moment");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const singup = async (userBody) => {
	let isUser = await User.findOne({ email: userBody.email, active: true });
    if (isUser?.userExpireTime && moment(isUser?.userExpireTime).isBefore(moment())) {
		await User.deleteOne({ email: userBody.email, active: true });
	}
    let stillUserExist = await User.findOne({ email: userBody.email, active: true });

	if (stillUserExist) {
		return {
			data: "User already exist with this email address.",
			status: false,
			code: 400,
		};
	}

	const user = await User.create(userBody);
	return { data: user, status: true, code: 200 };
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
	let user = await User.findOne({ email, active: true });

	if (user?.userExpireTime && moment(user?.userExpireTime).isBefore(moment())) {
		await User.deleteOne({ email, active: true });
		return { user: null, msg: "User account has expired and has been deleted." };
	}
	if (user && !(user.role == "user")){
		return { user: null, msg: "User is not authorized" };
    }
	if (!user || !(await user.isPasswordMatch(password))) {
		return { user: null, msg: "Incorrect email or password" };
	}

	return { user };
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
	const refreshTokenDoc = await Token.findOne({
		token: refreshToken,
		type: tokenTypes.REFRESH,
		blacklisted: false,
	});
	if (!refreshTokenDoc) {
		throw new ApiError(httpStatus.NOT_FOUND, "Not found");
	}
	await refreshTokenDoc.remove();
};

/**
 * getCurrentUser
 * @param {string} token
 * @returns {Promise}
 */
const getCurrentUser = async (token) => {
	try {
		const { user } = await tokenService.verifyToken(token, "refresh");
		const userData = await User.findOne({
			_id: mongoose.Types.ObjectId(user),
			active: true,
		});
		return { userData, status: true, statusCode: 200 };
	} catch (error) {
		return {
			userData: null,
			profileData: null,
			isError: "getCurrentUser failed",
			status: false,
			statusCode: 500,
		};
	}
};

//check Email already exists
const checkEmail = async (email) => {
	return await User.findOne({ email: email });
};

module.exports = {
	logout,
	getCurrentUser,
	loginUserWithEmailAndPassword,
	singup,
	checkEmail,
};
