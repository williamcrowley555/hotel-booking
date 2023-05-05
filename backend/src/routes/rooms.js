const express = require('express');
const router = express.Router();

const roomController = require('../app/controllers/RoomController');

const jwtMiddleware = require('../app/middlewares/jwtMiddleware');

router.post('/', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), roomController.create);

module.exports = router;
