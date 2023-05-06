const express = require('express');
const router = express.Router();

const roomController = require('../app/controllers/RoomController');

const jwtMiddleware = require('../app/middlewares/jwtMiddleware');

router.get('/:id', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), roomController.get);
router.get('/', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), roomController.getAll);
router.post('/', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), roomController.create);
router.patch('/:id/restore', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), roomController.restore);
router.patch('/:id', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), roomController.update);
router.delete('/:id', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), roomController.delete);

module.exports = router;
