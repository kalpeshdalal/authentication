const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const services = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");

const signup = catchAsync(async (req, res) => {
    const body  = pick(req.body, ['email', 'password', 'name'])
	const user = await services.registerUser(body);
    if(user.status){
        sendResponse( res, httpStatus.CREATED, user.data, "User registered successfully. OTP sent to your email.");
    }else{
        sendResponse( res, user.code, null, user.message, true);
    }
});


module.exports = signup;
