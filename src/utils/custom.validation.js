const Joi = require("joi");
const mongoose = require("mongoose");

const password = (value, helpers) => {
	if (value.length < 8) {
		return helpers.message("Password must be at least 8 characters long");
	}
	if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
		return helpers.message(
			"Password must contain at least one letter and one number"
		);
	}
	return value;
};

const objectId = (value, helpers) => {
	if (!mongoose.Types.ObjectId.isValid(value)) {
		return helpers.message("Invalid ID");
	}
	return value;
};

module.exports = {
	password,
	objectId,
};
