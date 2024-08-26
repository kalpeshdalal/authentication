function convertToJSON(str) {
	// Remove curly braces
	var str1 = str.replace(/[{}]/g, "");
	// Split by commas to get individual properties
	var properties = str1.split(",");
	var obj = {};

	properties.forEach(function (property) {
		var tup = property.split(":");
		// Trim any extra spaces and add to object
		obj[tup[0].trim()] = tup[1].trim();
	});

	return obj;
}

module.exports = {
	convertToJSON,
};
