const jsonwebtoken = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const mailChecker = require('mailchecker');
const crypto = require('crypto');
const usermodel = require('../model/user');
const sendEmail = require('../../server/utils/send-email');
const sendEmailForgotPassword = require('../../server/utils/send-email-forgot-password');
const generatePasswordResetToken = require('../../server/utils/generate-password-reset-token');
const userServiceLayer = require('../service/user')

const userService = new userServiceLayer();

require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

exports.register = async function (req, res) {
    try {
        // Validate request body
        const user = new usermodel(req.body);

        if (!req.body.password) {
            return res.status(400).json({ message: "Password must not be empty" });
        }
        user.hash_password = bcryptjs.hashSync(req.body.password, 10);

        if (!user.name) {
            return res.status(400).json({ message: "Name must not be empty" });
        }
        if (!user.email) {
            return res.status(400).json({ message: "Email must not be empty" });
        }
        if (!mailChecker.isValid(user.email)) {
            return res.status(400).json({ message: "Please provide a valid email address" });
        }
        if (!user.role) {
            return res.status(400).json({ message: "Role must not be empty" });
        }

        // Register the user
        const userToRegister = await userService.register(user);
        user.hash_password = undefined; // Do not send the hash password back

        // Send email
        const { email, password } = req.body;
        let emailSent = false;
        try {
            const sent = await sendEmail({ email, password });
            emailSent = !sent.error;
        } catch (error) {
            console.error('Error sending email:', error);
        }

        // Final response
        res.status(200).json({
            message: emailSent ? 'User registered and email sent successfully' : 'User registered, but email failed to send',
            user: userToRegister,
        });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.signin = async function (req, res) {
    try {
        const user = await userService.signin({ email: req.body.email })
        if (!user || !user.comparePassword(req.body.password)) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed. Invalid user or password.'
            });
        }
        res.json({
            success: true,
            token: jsonwebtoken.sign({
                name: user.name,
                email: user.email,
                role: user.role,
                _id: user._id
            }, secretKey, { expiresIn: '15m' }),
            refreshToken: jsonwebtoken.sign({
                name: user.name,
                email: user.email,
                role: user.role,
                _id: user._id
            }, secretKey, { expiresIn: '30m' })
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.refreshToken = async function (req, res) {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return res.status(403).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Verify the refresh token
        jsonwebtoken.verify(refreshToken, secretKey, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid or expired refresh token. Please log in again.'
                });
            }

            // Generate a new token
            const token = jsonwebtoken.sign({
                name: decoded.name,
                email: decoded.email,
                role: decoded.role,
                _id: decoded._id
            }, secretKey, { expiresIn: '15m' });

            res.json({
                success: true,
                token
            });
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.forgotPassword = async function (req, res) {
    try {
        const user = await userService.forgotPassword({ email: req.body.email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Fetching email failed. Invalid email address.'
            });
        }

        const { email } = req.body;
        const resetPasswordToken = await generatePasswordResetToken(user);
        const resetPasswordUrl = `${process.env.PRO_ORIGIN}/reset-password.html?token=${resetPasswordToken}`;

        try {
            const emailSent = await sendEmailForgotPassword({ email, resetPasswordUrl });

            if (!emailSent) {
                return res.status(500).json({
                    success: false,
                    message: 'Error sending email. Please try again later.'
                });
            }

            // Respond with success if email is sent
            return res.status(200).json({
                success: true,
                message: 'Password reset email sent successfully.'
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Failed to send email. Please try again later.'
            });
        }
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}

exports.validateResetToken = async function (req, res) {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required.'
            });
        }

        // Hash the token to match the stored hash
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Find the user by the token and check expiration
        const user = await userService.resetPassword({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: Date.now() } // Ensure token is not expired
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Token is valid.'
        });
    } catch (error) {
        console.error('Error in validateToken:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
};

exports.resetPassword = async function (req, res) {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required.'
            });
        }

        // Hash the token to match the stored hash
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Find the user by the token and check expiration        
        const user = await userService.resetPassword({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: Date.now() } // Ensure token is not expired
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token.'
            });
        }

        // Hash the new password
        user.hash_password = bcryptjs.hashSync(newPassword, 10);

        // Clear reset token and expiration
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful.'
        });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
};