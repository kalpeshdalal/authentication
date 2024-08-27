const TOKEN_MODEL = require("../token.model");

/**
 * Remove a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {string} type
 * @returns {Promise<Token>}
 */
const removeToken = async (token) => {
    const tokenDoc = await TOKEN_MODEL.deleteOne({
        token
    });

    if (tokenDoc.deletedCount === 0) {
		throw new Error("Token not found");
    }
};

module.exports = removeToken;
