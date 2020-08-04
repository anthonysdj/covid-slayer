const jwt = require('jsonwebtoken');

function authApi(req, res, next) {
    const token = req.header('X-Auth-Token');

    if (!token) return res.status(401).send('Access denied!');

    try {
        const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = payload;
        next();
    } catch(e) {
        res.status(401).send('Invalid token.');
    }
}

module.exports = authApi;