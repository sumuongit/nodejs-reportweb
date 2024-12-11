//**********DEPENDENCIES**********//
const express = require('express');
const userController = require('../controller/user');
const router = express.Router();

//**********API ENDPOINTS**********//
router.post('/auth/register', userController.register);
router.post('/auth/signin', userController.signin);

module.exports = router;
