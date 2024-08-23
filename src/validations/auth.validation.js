const Joi = require('joi');
const { password,emailCustom } = require('./custom.validation');

const phoneNumberPattern = /^[6-9]\d{9}$/;


const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": `Email must contain a value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be a valid email`,
    }),
    password: Joi.string().required().min(8).regex(/\d/).regex(/[a-zA-Z]/).messages({
      "string.empty": `Password must contain a value`,
      "any.required": `Password is a required field`,
      "string.min": `Password must be at least 8 characters long`,
      "string.pattern.base": `Password must contain at least one letter and one number`,
    }),
    name: Joi.string().optional().messages({
      "string.empty": `Name must contain a value`,
    }),
    phone: Joi.string().required().pattern(phoneNumberPattern).messages({
      "string.empty": `Phone number must contain a value`,
      "any.required": `Phone number is a required field`,
      "string.pattern.base": `Phone number must be a valid 10-digit Indian mobile number starting with 6-9`,
    }),
    selectedLanguage: Joi.string().valid('english', 'marathi').optional().messages({
      "any.only": `Selected language must be either 'english' or 'marathi'`,
    }),
  }),
};

const signup = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": `Email must contain a value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be a valid email`,
    }),
    password: Joi.string().required().min(8).regex(/\d/).regex(/[a-zA-Z]/).messages({
      "string.empty": `Password must contain a value`,
      "any.required": `Password is a required field`,
      "string.min": `Password must be at least 8 characters long`,
      "string.pattern.base": `Password must contain at least one letter and one number`,
    }),
    name: Joi.string().optional().messages({
      "string.empty": `Name must contain a value`,
    }),
    phone: Joi.string().required().pattern(phoneNumberPattern).messages({
      "string.empty": `Phone number must contain a value`,
      "any.required": `Phone number is a required field`,
      "string.pattern.base": `Phone number must be a valid 10-digit Indian mobile number starting with 6-9`,
    }),
    selectedLanguage: Joi.string().valid('english', 'marathi').optional().messages({
      "any.only": `Selected language must be either 'english' or 'marathi'`,
    }),
  }),
};


const login = {
  body: Joi.object().keys({
    email: Joi.string().required().custom(emailCustom).messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`
    }),
    password: Joi.string().required().messages({
      "string.empty": `Password must contain value`
    }),
  }),
};
//change 


const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};



module.exports = {
  register,
  login,
  logout,
  signup,
  
};

