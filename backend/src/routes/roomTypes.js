const express = require('express');
const { uploadImage } = require('../config/multer');

const router = express.Router();

const roomTypeController = require('../app/controllers/RoomTypeController');

const jwtMiddleware = require('../app/middlewares/jwtMiddleware');

router.post(
    '/',
    jwtMiddleware.verifyManagerToken.bind(jwtMiddleware),
    uploadImage.array('uploadImages'),
    roomTypeController.create,
);

module.exports = router;
