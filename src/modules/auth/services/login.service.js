const httpStatus = require("http-status");
const USER_MODEL = require("../user.model");

const login = async (email, password) => {
    let user = await USER_MODEL.findOne({ email, active: true });

    if (!user) {
        return { message: "Email not found. Proceed to signup.", code: httpStatus.NOT_FOUND, status: false };
    }

    if (user.isLocked) {
        return { message: "Account is locked due to multiple failed login attempts. Please try again later.", code: httpStatus.FORBIDDEN, status: false };
    }

    if (!user.isEmailVerified) {
        return { message: "Email is not verified. Please verify your email to continue.", code: httpStatus.UNAUTHORIZED, status: false };
    }

    if (user.role !== "user") {
        return { message: "User is not authorized", code: httpStatus.UNAUTHORIZED, status: false };
    }

    if (!(await user.isPasswordMatch(password))) {
        await user.incrementLoginAttempts();
        return { message: "Incorrect password", code: httpStatus.BAD_REQUEST, status: false };
    }

    await user.updateOne({ $set: { loginAttempts: 0 }, $unset: { lockUntil: 1 } });

    return { data: user, code: httpStatus.OK, status: true };
};

module.exports = login;
