const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const services = require("../services");

const resendOtp = catchAsync(async (req, res) => {
    const { email } = pick(req.body, ['email']);

	const result = await services.resendOtp(email, req);

	if(result.status) {
		sendResponse(res, result.code, result.data, result.message);
	} else {
		sendResponse(res, result.code, null, result.message, true);
	}
});

module.exports = resendOtp;
