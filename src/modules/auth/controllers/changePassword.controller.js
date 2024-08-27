const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const services = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");

/**
 * Change Password
 * @param {Object} req
 * @param {Object} res
 */
const changePassword = catchAsync(async (req, res) => {
    const { token, newPassword } = pick(req.body, ['token', 'newPassword']);

    const result = await services.changePassword(token, newPassword);

    if (!result.status) {
        sendResponse(res, result.code, null, result.message, true);
    } else {
        sendResponse(res, httpStatus.OK, null, "Password changed successfully.");
    }
});

module.exports = changePassword;
