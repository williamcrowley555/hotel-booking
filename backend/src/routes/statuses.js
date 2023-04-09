const express = require('express');
const router = express.Router();

const statusController = require('../app/controllers/StatusController');

const jwtMiddleware = require('../app/middlewares/jwtMiddleware');

router.post('/addStatus', jwtMiddleware.verifyToken, statusController.addStatus);
router.get('/', jwtMiddleware.verifyToken, statusController.getAll);

//router.patch('/', jwtMiddleware.verifyToken, meController.update);

module.exports = router;
