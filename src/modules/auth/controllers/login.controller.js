const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const services = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");
const tokenServices = require("../../token/services");

const login = catchAsync(async (req, res) => {
    const { email, password } = pick(req.body, ['email', 'password']);
	const user = await services.login(email, password);
    if(user?.status){
        const tokens = await tokenServices.generateAuthTokens(user.data);
        sendResponse( res, 200, { user:user.data, tokens }, "Login successful!!");
    }else{
        sendResponse( res, user.code, null, user.message, true);
    }
});


module.exports = login;
