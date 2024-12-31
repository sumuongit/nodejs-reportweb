const jwt = require('jsonwebtoken');

require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const generateSignedUrl = async (reportUrl) => {
    const payload = {
        url: reportUrl,
        exp: Math.floor(Date.now() / 1000) + 3600
    }; // Expires in 1 hour // Date.now() + 600000 // Expiry time in milliseconds (e.g., 10 minutes)

    if (!secretKey) {
        throw new Error('JWT secret key is not defined.');
    }
    return jwt.sign(payload, secretKey);
}

module.exports = generateSignedUrl;
