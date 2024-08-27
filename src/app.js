const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const httpStatus = require("http-status");
const config = require("./config/config.js");
const morgan = require("./config/morgan.js");
const { authLimiter } = require("./middlewares/rateLimiter.js");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error.js");
const ApiError = require("./utils/ApiError.js");
const { jwtStrategy } = require("./config/passport.js");
const session = require("express-session");
const passport = require("passport");
const path = require('path'); 

const app = express();

// Use morgan for logging requests in development mode
if (config.env === "development") {
	app.use(morgan.morganMiddleware);
	app.use(morgan.errorMorganMiddleware);
}

// Set security HTTP headers
app.use(helmet());

// Sanitize request data to prevent NoSQL injection
app.use(mongoSanitize());

// Prevent XSS attacks by cleaning user input
app.use(xss());

// Compress response bodies for better performance
app.use(compression());

// Enable CORS
app.use(cors());
app.options("*", cors());

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Initialize session
app.use(
	session({
		secret: config.session.secret,
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: config.env === "production",
			httpOnly: true,
			maxAge: 60 * 60 * 1000,
		},
	})
);

passport.serializeUser(function (user, done) {
	done(null, user);
});
passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

app.use(passport.initialize());

app.use(passport.session());

passport.use("jwt", jwtStrategy);

// Rate limiting to prevent brute force attacks on authentication endpoints
if (config.env === "production") {
	app.use("/auth", authLimiter);
}

// Routes
app.use("/v1", routes);

app.all("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle error
app.use(errorHandler);

module.exports = app;
