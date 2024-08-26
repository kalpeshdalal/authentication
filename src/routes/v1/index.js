// src/routes/v1/index.js

const express = require("express");
const config = require("../../config/config");
const authRoute = require("./auth.route");
const docsRoute = require("./doc.route");

const router = express.Router();

const defaultRoutes = [
	{
		path: "/auth",
		route: authRoute,
	},
];

const devRoutes = [
	{
		path: "/docs",
		route: docsRoute,
	},
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

if (config.env === "development") {
	devRoutes.forEach((route) => {
		router.use(route.path, route.route);
	});
}

module.exports = router;
