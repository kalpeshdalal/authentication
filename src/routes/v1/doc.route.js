// src/routes/v1/docs.js

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const config = require("../../config/config");
const swaggerSpec = require("../../config/swagger");

const router = express.Router();


if (config.env === "development") {
	router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = router;
