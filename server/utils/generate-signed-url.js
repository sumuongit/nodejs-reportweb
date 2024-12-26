const jwt = require('jsonwebtoken');

const generateSignedUrl = async (reportUrl) => {
    const payload = {
        url: reportUrl,
        exp: Math.floor(Date.now() / 1000) + 3600
    }; // Expires in 1 hour
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
        throw new Error('JWT secret key is not defined.');
    }
    return jwt.sign(payload, secretKey);
}

module.exports = generateSignedUrl;
