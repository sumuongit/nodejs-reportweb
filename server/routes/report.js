const express = require('express');
const reportController = require('../controller/report');
const jwtVerify = require('../middleware/jwt-verify');
const router = express.Router();

router.get('/report/read', jwtVerify.tokenVerify, reportController.read);

module.exports = router;