function toJSON(schema) {
	schema.methods.toJSON = function () {
		const obj = this.toObject();

		delete obj.__v;
		delete obj.password;
		delete obj.passwordHistory;
		delete obj.otp;

		return obj;
	};
}

module.exports = toJSON;
