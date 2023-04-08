const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/MeController');

const jwtMiddleware = require('../app/middlewares/jwtMiddleware');

router.get('/', jwtMiddleware.verifyToken, meController.me);
router.patch('/', jwtMiddleware.verifyToken, meController.update);

module.exports = router;
