const Room = require('../models/Room');
const RoomStatus = require('../models/RoomStatus');
const RoomType = require('../models/RoomType');

class RoomController {
    /* 
        [GET] /v1/rooms
        [GET] /v1/rooms?sortBy=roomNo:desc
        [GET] /v1/features?page=1&limit=10
        [GET] /v1/rooms?deleted=false
    */
    async getAll(req, res, next) {
        const sort = {};
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        const options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            populate: ['status', 'roomType'],
            sort,
            collation: { locale: 'vi', strength: 2 }, // Case-insensitive sorting
        };

        const { docs, totalDocs, ...pagination } = await Room.paginate(
            { deleted: req.query.deleted === 'true' },
            options,
        );

        return res.status(200).send({
            rooms: docs,
            totalRooms: totalDocs,
            ...pagination,
        });
    }

    // [GET] /v1/rooms/:id
    async get(req, res, next) {
        const room = await Room.findById(req.params.id).populate('status').populate('roomType');
        if (room) {
            return res.status(200).send(room);
        } else {
            return res.status(404).send({ message: 'Room not found' });
        }
    }

    // [POST] /v1/rooms
    async create(req, res, next) {
        // Check if room status exists
        if (req.body.status) {
            const roomStatus = await RoomStatus.findOne({ _id: req.body.status });

            if (!roomStatus) {
                return res.status(404).send({ message: 'Room status not found' });
            }
        }

        // Check if room type exists
        if (req.body.roomType) {
            const roomType = await RoomType.findOne({ _id: req.body.roomType });

            if (!roomType) {
                return res.status(404).send({ message: 'Room type not found' });
            }
        }

        // Find existing room by case-insensitive room no and floor
        const existingRoom = await Room.findOne({
            roomNo: new RegExp(req.body.roomNo, 'i'),
            floor: new RegExp(req.body.floor, 'i'),
        });

        if (existingRoom) {
            return res.status(400).send({ message: 'Room already exists' });
        }

        const savedRoom = await new Room(req.body).save();
        return res.status(201).send(savedRoom);
    }

    // [PATCH] /v1/rooms/:id
    async update(req, res, next) {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['roomNo', 'floor', 'status', 'extraInfo', 'roomType', 'disableDates'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ message: 'Invalid updates!' });
        }

        // Check if room status exists
        if (req.body.status) {
            const roomStatus = await RoomStatus.findOne({ _id: req.body.status });

            if (!roomStatus) {
                return res.status(404).send({ message: 'Room status not found' });
            }
        }

        // Check if room type exists
        if (req.body.roomType) {
            const roomType = await RoomType.findOne({ _id: req.body.roomType });

            if (!roomType) {
                return res.status(404).send({ message: 'Room type not found' });
            }
        }

        const { id } = req.params;

        const room = await Room.findOneWithDeleted({ _id: id });

        if (!room) {
            return res.status(404).send({ message: 'Room not found' });
        }

        // Find existing room by case-insensitive room no and floor
        const existingRoom = await Room.findOne({
            _id: { $ne: id },
            roomNo: new RegExp(req.body.roomNo, 'i'),
            floor: new RegExp(req.body.floor, 'i'),
        });

        if (existingRoom) {
            return res.status(400).send({ message: 'Room already exists' });
        }

        const updatedRoom = await Room.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
        });

        return res.status(201).send(updatedRoom);
    }

    // [PATCH] /rooms/:id/restore
    async restore(req, res, next) {
        const room = await Room.findOneDeleted({ _id: req.params.id });
        if (!room) {
            return res.status(404).send({ message: 'Room not found' });
        }

        // Find existing room that is not deleted by case-insensitive room no and floor
        const existingRoom = await Room.findOne({
            _id: { $ne: req.params.id },
            roomNo: new RegExp(room.roomNo, 'i'),
            floor: new RegExp(room.floor, 'i'),
        });
        if (existingRoom) {
            return res.status(400).send({ message: 'Room already exists' });
        }

        const restoredRoom = await room.restore({ _id: req.params.id });
        if (!restoredRoom) {
            return res.status(500).send({ message: 'Restore room failed' });
        }
        return res.status(200).send(restoredRoom);
    }

    // [DELETE] /v1/rooms/:id
    async delete(req, res, next) {
        const room = await Room.findOne({ _id: req.params.id });
        if (!room) {
            return res.status(404).send({ message: 'Room not found' });
        }

        await room.delete();
        return res.status(200).send({ message: 'Room deleted successfully' });
    }
}

module.exports = new RoomController();
