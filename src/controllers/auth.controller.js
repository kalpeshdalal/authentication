

const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const moment = require('moment');
const { authService, tokenService } = require('../services');
const { sendResponse } = require('../utils/responseHandler');
const register = catchAsync(async (req, res) => {

  try {
    const { email, password, name, phone, selectedLanguage} = req.body;
    const expires = moment().add(1440, 'minutes');
    let userObj = {
      email,
      password,
      name,
      userExpireTime: expires,
      phone: phone,
      selectedLanguage: selectedLanguage
    };

    const user = await authService.singup(userObj);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
  } catch (error) {
    sendResponse(res, httpStatus.BAD_REQUEST, error.message, null, null);
  }

});

const singup = catchAsync(async (req, res) => {

  try {
    const { email, password, name, phone, selectedLanguage} = req.body;
    const expires = moment().add(1440, 'minutes');
    let userObj = {
      email,
      password,
      name,
      userExpireTime: expires,
      phone: phone,
      selectedLanguage: selectedLanguage
    };

    const user = await authService.singup(userObj);
    if (user.code == 200) {
      const tokens = await tokenService.generateAuthTokens(user.data);
      res.status(httpStatus.CREATED).send({ user, tokens });
    }
    sendResponse(res, httpStatus.BAD_REQUEST, user, null)
  } catch (error) {
    sendResponse(res, httpStatus.BAD_REQUEST, error.message, null)
  }

});










const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (user && !user.user) {
    sendResponse(res, httpStatus.FORBIDDEN, null, user.msg);
    return;
  }
  const tokens = await tokenService.generateAuthTokens(user.user);
  sendResponse(res, httpStatus.OK, { user: user.user, tokens }, null);
});








const getCurrentUser = catchAsync(async (req, res) => {
  try {
    const { token } = req.body;
    const userRes = await authService.getCurrentUser(token);
    if (userRes.status) {
      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: true,
        data: { userData: userRes.userData, profileData: userRes.profileData }
      });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        code: httpStatus.INTERNAL_SERVER_ERROR,
        status: false,
        data: 'something went wrong',
      });
    }
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      data: err.message,
    });
  }
});

const logout = catchAsync(async (req, res) => {
  let done = await authService.logout(req.body.refreshToken);
  console.log(done);
  res.status(httpStatus.NO_CONTENT).json({
    status: httpStatus.NO_CONTENT,
    data: "Account Logout ",
  });
});


module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  singup,
};
