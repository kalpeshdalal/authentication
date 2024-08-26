const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { roles } = require("../../config/roles");
const { paginate, toJSON } = require("../../plugins");
const incrementCounter = require("../../utils/counterIncrementer");

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		role: {
			type: String,
			enum: roles,
			default: "user",
		},
		otp: {
			code: String,
			expires: Date,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		loginAttempts: {
			type: Number,
			default: 0,
		},
		lockUntil: {
			type: Date,
		},
        active:{
            type: Boolean,
			default: true,  
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
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// Virtual for tracking if the user is locked
userSchema.virtual("isLocked").get(function () {
	return !!(this.lockUntil && this.lockUntil > moment().toDate());
});

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
	const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
	return !!user;
};
// Compare the user's password with the hashed password in the database
userSchema.methods.isPasswordMatch = async function (password) {
	return bcrypt.compare(password, this.password);
};

// Increment login attempts and lock account if necessary
userSchema.methods.incrementLoginAttempts = async function () {
	if (this.lockUntil && this.lockUntil < moment().toDate()) {
		// Unlock account if lock has expired
		return this.updateOne({
			$set: { loginAttempts: 1 },
			$unset: { lockUntil: 1 },
		});
	}
	const updates = { $inc: { loginAttempts: 1 } };
	if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
		// Lock the account for 2 hours
		updates.$set = { lockUntil: moment().add(2, "hours").toDate() };
	}
	return this.updateOne(updates);
};



userSchema.pre("save", async function (next) {
	if (this.isNew) {
		this.seqId = await incrementCounter("user");
	}
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 8);
	}
	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
