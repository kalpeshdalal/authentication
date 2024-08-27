
const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const services = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");


const verifyForgetPasswordOtp = catchAsync(async (req, res) => {
    const { token, otp } = pick(req.body, ['token', 'otp']);
    
	const result = await services.verifyForgetPasswordOtp(token, otp, req);

    if(!result.status){
        sendResponse( res, result.code, null, result.message, true);
    }else{
        sendResponse( res, httpStatus.OK, { user: result.data}, "OTP verified successfully.");
    }

});

module.exports = verifyForgetPasswordOtp;
