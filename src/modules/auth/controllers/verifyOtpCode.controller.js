
const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const services = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");
const tokenServices = require("../../token/services");


const verifyOtpCode = catchAsync(async (req, res) => {
	const { email, otp } = req.body;
	const user = await services.verifyOtp(email, otp, req);
    if(!user.status){
        sendResponse( res, user.code, null, user.message, true);
    }
	const tokens = await tokenServices.generateAuthTokens(user.data);
    if(!tokens){
        sendResponse( res, 400, null, 'Unable to generate OTP', true);
    }

	sendResponse( res, httpStatus.OK, { user: user.data, tokens }, "OTP verified successfully.");
});

module.exports = verifyOtpCode;
