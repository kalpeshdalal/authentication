const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
	message:
		"Too many login attempts from this IP, please try again after 15 minutes",
});

module.exports = {
	authLimiter,
};
