const express = require('express');
const router = express.Router();

const statusController = require('../app/controllers/StatusController');

const jwtMiddleware = require('../app/middlewares/jwtMiddleware');

router.patch('/:id/restore', jwtMiddleware.verifyToken, statusController.restore);
router.patch('/:id', jwtMiddleware.verifyToken, statusController.update);
router.delete('/:id', jwtMiddleware.verifyToken, statusController.destroy);
router.post('/store', jwtMiddleware.verifyToken, statusController.add);
router.get('/:id', jwtMiddleware.verifyToken, statusController.getOne);
router.get('/', jwtMiddleware.verifyToken, statusController.getAll);

//router.patch('/', jwtMiddleware.verifyToken, meController.update);

module.exports = router;
