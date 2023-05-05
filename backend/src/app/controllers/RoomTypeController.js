const RoomType = require('../models/RoomType');
const path = require('path');
const url = require('url');
const { bucket } = require('../../config/firebase');
const { isImage } = require('../../util/multer');
const { uploadFileToStorage, deleteFileFromStorage } = require('../../util/firebase');

const imageFolder = 'room-type-images';

const parseJson = (value) => {
    try {
        return JSON.parse(value);
    } catch (error) {
        return value;
    }
};

class RoomTypeController {
    // [POST] /v1/room-types
    async create(req, res, next) {}
}

module.exports = new RoomTypeController();
