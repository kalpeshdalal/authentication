const mongoose = require("mongoose");
const moment = require("moment");
const { tokenTypes } = require("../../config/tokenTypes");
const { paginate, toJSON } = require("../../plugins");
const incrementCounter = require("../../utils/counterIncrementer");

const tokenSchema = new mongoose.Schema(
	{
		token: {
			type: String,
			required: true,
			unique: true,
		},
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: [
				tokenTypes.ACCESS,
				tokenTypes.REFRESH,
				tokenTypes.RESET_PASSWORD,
				tokenTypes.VERIFY_EMAIL,
			],
			required: true,
		},
		expires: {
			type: Date,
			required: true,
		},
		blacklisted: {
			type: Boolean,
			default: false,
		},
		seqId: {
			type: Number,
			unique: true,
		},
	},
	{
		timestamps: true,
	}
);

// Add plugin that converts mongoose to JSON
tokenSchema.plugin(toJSON);
tokenSchema.plugin(paginate);

// Middleware to automatically increment the counter and assign it to seqId
tokenSchema.pre("save", async function (next) {
	if (this.isNew) {
		this.seqId = await incrementCounter("token");
	}
	next();
});

/**
 * Check if the token is expired
 * @returns {boolean}
 */
tokenSchema.methods.isExpired = function () {
	return moment().isAfter(this.expires);
};

/**
 * Check if the token is blacklisted or expired
 * @returns {boolean}
 */
tokenSchema.methods.isValid = function () {
	return !this.blacklisted && !this.isExpired();
};

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
