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
	res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Kalpesh Pradeep Dalal - Full Stack Developer</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f7f7f7;
                }
                .container {
                    text-align: center;
                    background-color: #fff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    max-width: 400px;
                }
                img {
                    border-radius: 50%;
                    width: 150px;
                    height: 150px;
                    object-fit: cover;
                    margin-bottom: 20px;
                }
                h1 {
                    color: #333;
                    margin: 0;
                    font-size: 24px;
                }
                p {
                    color: #555;
                    margin: 10px 0;
                    font-size: 16px;
                }
                a {
                    color: #0073b1;
                    text-decoration: none;
                    font-size: 16px;
                }
                a:hover {
                    text-decoration: underline;
                }
                .contact-info {
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Kalpesh Pradeep Dalal</h1>
                <p>Full Stack Developer</p>
                <div class="contact-info">
                    <p>Email: <a href="mailto:kalpeshdalal305@gmail.com">kalpeshdalal305@gmail.com</a></p>
                    <p>Phone: <a href="tel:+917038344755">+91 7038344755</a></p>
                    <p>Location: Aurangabad, India</p>
                </div>
                <p><a href="https://www.linkedin.com/in/kalpesh-dalal-2a4557208/" target="_blank">LinkedIn Profile</a></p>
                <p><a href="https://github.com/kalpeshdalal305" target="_blank">GitHub Profile</a></p>
            </div>
        </body>
        </html>
    `);
});

// Handle unknown routes
app.use((req, res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle error
app.use(errorHandler);

module.exports = app;
