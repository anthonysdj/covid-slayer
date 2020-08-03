const jwt = require('jsonwebtoken');

const generateAuthToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_PRIVATE_KEY);
}

module.exports.generateAuthToken = generateAuthToken;