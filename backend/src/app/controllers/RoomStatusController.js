const RoomStatus = require('../models/RoomStatus');

class RoomStatusController {
    /* 
        [GET] /v1/room-statuses
        [GET] /v1/room-statuses?sortBy=name:desc
        [GET] /v1/room-statuses?deleted=false
    */
    async getAll(req, res, next) {
        const sortOption = {};
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sortOption[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        const roomStatuses =
            req.query.deleted === 'true'
                ? await RoomStatus.findDeleted({}).sort(sortOption)
                : await RoomStatus.find({}).sort(sortOption);

        return res.status(200).send(roomStatuses);
    }

    // [GET] /v1/room-statuses/:id
    async get(req, res, next) {
        const roomStatus = await RoomStatus.findById(req.params.id);
        if (roomStatus) {
            return res.status(200).send(roomStatus);
        } else {
            return res.status(404).send({ message: 'Room status not found' });
        }
    }

    // [POST] /v1/room-statuses
    async create(req, res, next) {
        // Find a room status with a case-insensitive name
        const existingRoomStatus = await RoomStatus.findOne({ name: new RegExp(req.body.name, 'i') });

        if (existingRoomStatus) {
            return res.status(400).send({ message: 'Room status already exists' });
        }

        const savedRoomStatus = await new RoomStatus(req.body).save();
        return res.status(201).send(savedRoomStatus);
    }

    // [PATCH] /v1/room-statuses/:id
    async update(req, res, next) {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ message: 'Invalid updates!' });
        }

        const { id } = req.params;

        const roomStatus = await RoomStatus.findOneWithDeleted({ _id: id });

        if (!roomStatus) {
            return res.status(404).send({ message: 'Room status not found' });
        }

        // Find a room status with a case-insensitive name
        const existingRoomStatus = await RoomStatus.findOne({ _id: { $ne: id }, name: new RegExp(req.body.name, 'i') });
        if (existingRoomStatus) {
            return res.status(400).send({ message: 'Room status already exists' });
        }

        const updatedRoomStatus = await RoomStatus.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
        });

        return res.status(201).send(updatedRoomStatus);
    }

    // [DELETE] /v1/room-statuses/:id
    async delete(req, res, next) {
        const roomStatus = await RoomStatus.findOne({ _id: req.params.id });
        if (!roomStatus) {
            return res.status(404).send({ message: 'Room status not found' });
        }

        await roomStatus.delete();
        return res.status(200).send({ message: 'Room status deleted successfully' });
    }
}

module.exports = new RoomStatusController();
