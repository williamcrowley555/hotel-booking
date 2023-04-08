const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');

const jwtMiddleware = require('../app/middlewares/jwtMiddleware');

router.get('/:id', jwtMiddleware.verifyAdminToken.bind(jwtMiddleware), userController.get);
router.get('/', jwtMiddleware.verifyAdminToken.bind(jwtMiddleware), userController.getAll);

module.exports = router;
