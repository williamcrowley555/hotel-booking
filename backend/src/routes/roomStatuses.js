const express = require('express');
const router = express.Router();

const roomStatusController = require('../app/controllers/RoomStatusController');

const jwtMiddleware = require('../app/middlewares/jwtMiddleware');

router.get('/:id', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), roomStatusController.get);
router.get('/', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), roomStatusController.getAll);
router.post('/', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), roomStatusController.create);
router.patch('/:id', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), roomStatusController.update);
router.delete('/:id', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), roomStatusController.delete);

module.exports = router;
