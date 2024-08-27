const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const services = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");

/**
 *  forget password request
 * @param {Object} req
 * @param {Object} res
 */

const forgetPassword = catchAsync(async (req, res) => {
    const { email } = pick(req.body, ['email']);

	const result = await services.forgetPassword(email, req);

	if (result.status) {
		sendResponse(res, httpStatus.OK, { token: result.token }, "OTP sent to your email.");
	} else {
		sendResponse(res, result.code, null, result.message, true);
	}
});

module.exports = forgetPassword;
