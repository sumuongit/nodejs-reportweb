//**********DEPENDENCIES**********//
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

//**********CONFIGURATION**********//
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

//**********CRUD**********//
exports.register = async function (req, res) {
    const user = new usermodel(req.body);

    if (req.body.password) {
        user.hash_password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (!user.name) {
        res.status(400).json({ message: "Name must not be empty" });
        return;
    }

    if (!user.email) {
        res.status(400).json({ message: "Email must not be empty" });
        return;
    }

    if (!mailChecker.isValid(user.email)) {
        res.status(400).json({ message: "Please provide a valid email address" });
        return;
    }

    if (!user.role) {
        res.status(400).json({ message: "Role must not be empty" });
        return;
    }

    if (!user.hash_password) {
        res.status(400).json({ message: "Password must not be empty" });
        return;
    }

    try {
        // Register the user
        const userToRegister = await userService.register(user);
        user.hash_password = undefined;

        // Send an email
        const { name, email, password } = req.body;
        try {
            const sent = await sendEmail({ name, email, password });
            if (sent.error) {
                res.status(500).json({ error: 'Error sending email' });
            }
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Internal server error' });
        }

        // Respond to the client
        res.status(200).json(userToRegister);
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

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
            }, secretKey)
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

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
        const resetPasswordUrl = `${process.env.PRO_ORIGIN}/reset-password?token=${resetPasswordToken}`;

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

exports.resetPassword = async function (req, res) {
    try {
        const { token, newPassword } = req.body;

        // Validate input
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