const express = require('express');
const router = express.Router();

const authController = require('../app/controllers/AuthController');

const jwtMiddleware = require('../app/middlewares/jwtMiddleware');

router.post('/register', authController.registerUser);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', jwtMiddleware.verifyToken, authController.logout);
router.post('/logout-all', jwtMiddleware.verifyToken, authController.logoutAll);

module.exports = router;
