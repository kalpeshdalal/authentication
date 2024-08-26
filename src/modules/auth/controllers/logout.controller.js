const catchAsync = require("../../../utils/catchAsync");
const services = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");

const logout = catchAsync(async (req, res) => {
    const { refreshToken } = pick(req.body, ['refreshToken']);
	const user = await services.logout(refreshToken);
    if(user?.status){
        sendResponse( res, 200, null, "Logout successful!!");
    }else{
        sendResponse( res, user.code, null, user.message, true);
    }
});


module.exports = logout;
