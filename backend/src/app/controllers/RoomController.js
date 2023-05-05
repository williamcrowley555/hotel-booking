const Room = require('../models/Room');

class RoomController {
    // [POST] /v1/rooms
    async create(req, res, next) {
        // Find existing room by case-insensitive room no and floor
        const existingRoom = await Room.findOne({
            roomNo: new RegExp(req.body.roomNo, 'i'),
            floor: new RegExp(req.body.floor, 'i'),
        });

        if (existingRoom) {
            return res.status(400).send({ message: 'Room already exists' });
        }

        const savedRoom = await new Room(req.body).save();
        return res.status(201).send(savedRoomType);
    }
}

module.exports = new RoomController();
