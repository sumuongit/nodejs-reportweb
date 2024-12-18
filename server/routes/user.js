//**********DEPENDENCIES**********//
const express = require('express');
const userController = require('../controller/user');
const jwtVerify = require('../middleware/jwt-verify');
const router = express.Router();

//**********API ENDPOINTS**********//
router.post('/auth/register', jwtVerify.tokenVerify, userController.register);
router.post('/auth/signin', userController.signin);
router.post('/auth/forgotPassword', userController.forgotPassword);
router.post('/auth/resetPassword', userController.forgotPassword);

module.exports = router;
