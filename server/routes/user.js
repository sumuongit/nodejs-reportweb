const express = require('express');
const userController = require('../controller/user');
const jwtVerify = require('../middleware/jwt-verify');
const router = express.Router();

router.post('/auth/register', jwtVerify.tokenVerify, userController.register);
router.post('/auth/registerEx', userController.register);
router.post('/auth/signin', userController.signin);
router.post('/auth/signout', jwtVerify.tokenVerify, userController.signout);
router.post('/auth/refreshToken', userController.refreshToken);
router.post('/auth/forgotPassword', userController.forgotPassword);
router.post('/auth/validateResetToken', userController.validateResetToken);
router.post('/auth/resetPassword', userController.resetPassword);

module.exports = router;
