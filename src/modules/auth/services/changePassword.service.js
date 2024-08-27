const USER_MODEL = require("../user.model");
const tokenServices = require("../../token/services");
const { tokenTypes } = require("../../../config/tokenTypes");
const bcrypt = require("bcryptjs");
const httpStatus = require("http-status");
const mongoose  = require("mongoose");

/**
 * Change Password
 * @param {string} token - The token received from the user
 * @param {string} newPassword - The new password entered by the user
 * @returns {Promise<Object>}
 */
const changePassword = async (token, newPassword) => {
    try {
        const tokenDoc = await tokenServices.verifyToken(token, tokenTypes.RESET_PASSWORD);

        const user = await USER_MODEL.findOne({ _id: mongoose.Types.ObjectId(tokenDoc.user) });


        if (!user) {
            return { message: "User not found", code: httpStatus.NOT_FOUND, status: false };
        }

        if (!user.isForgetPasswordOTPVerified) {
            return { message: "OTP not verified", code: httpStatus.FORBIDDEN, status: false };
        }

        user.password = await bcrypt.hash(newPassword, 8);
        user.isForgetPasswordOTPVerified = false; 
        await user.save();

        return { status: true };
    } catch (error) {
        return { message: error.message, code: httpStatus.UNAUTHORIZED, status: false };
    }
};

module.exports = changePassword;
