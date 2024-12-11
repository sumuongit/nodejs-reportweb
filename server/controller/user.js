//**********DEPENDENCIES**********//
const jsonwebtoken = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const mailChecker = require('mailchecker');
const usermodel = require('../model/user');
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
        const userToRegister = await userService.register(user);
        user.hash_password = undefined;
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
