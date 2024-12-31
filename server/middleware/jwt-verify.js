const jwt = require('jsonwebtoken');

require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

exports.tokenVerify = function (req, res, next) {
    const token = req.headers.authorization;    
    if (!token) {
        res.status(403).json({
            success: false,
            message: err.message
        })
    }
    else {
        jwt.verify(token.split(' ')[1], secretKey, (err, value) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err.message
                })
            }
            req.user = value.data;
            next();
        })
    }
}