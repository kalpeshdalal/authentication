const sendResponse = (
	res,
	statusCode,
	data = null,
	message = "Success",
	error = false
) => {
	const response = {
		message,
		status: statusCode,
		error,
		data: data || undefined,
	};

	return res.status(statusCode).json(response);
};

module.exports = {
	sendResponse,
};
