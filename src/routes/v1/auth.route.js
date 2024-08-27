// src/routes/v1/auth.js

const express = require('express');
const validate = require('../../middlewares/validate');
const authController = require('../../modules/auth/controllers');
const authValidation = require('../../modules/auth/user.validation');

const router = express.Router();

router.post('/signup', validate(authValidation.signup), authController.signup);

router.post('/verify-otp', validate(authValidation.otpVerification), authController.verifyOtpCode);

router.post('/login', validate(authValidation.login), authController.login);

router.post('/logout', validate(authValidation.logout), authController.logout);

router.post('/resend-otp', validate(authValidation.resendOtp), authController.resendOtp);

router.post('/forget-password', validate(authValidation.forgetPassword), authController.forgetPassword);

router.post('/verify-otp-forget-password', validate(authValidation.verifyForgetPasswordOtp), authController.verifyForgetPasswordOTP);

router.post('/change-password', validate(authValidation.changePassword), authController.changePassword);

module.exports = router;


/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with email, password, and OTP verification.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User registered successfully. OTP sent to your email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP for user registration
 *     description: Verify the OTP sent to the user's email during registration.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/Tokens'
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticate a user using their email and password. Returns user details and tokens if successful.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/Tokens'
 *       400:
 *         description: Invalid email or password
 *       401:
 *         description: Unauthorized (account locked or email not verified)
 *       403:
 *         description: Forbidden (User is not authorized)
 *       404:
 *         description: User not found
 */


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     description: Log out the authenticated user and invalidate their tokens.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully logged out
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       404:
 *         description: Token not found 
 */

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP for user verification
 *     description: Resend the OTP to the user's email if the previous OTP has expired or is invalid.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP resent successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *       400:
 *         description: Bad request (e.g., OTP is still valid)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP is still valid. Please wait for the current OTP to expire.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       429:
 *         description: Too many requests (OTP request limit reached)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP request limit reached. Please try again later.
 */
