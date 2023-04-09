const Status = require('../models/Status');

class StatusController {
    /* 
        [GET] /v1/statuses
        [GET] /v1/statuses?sendEmail=true
        [GET] /v1/statuses?sortBy=createdAt:desc
        [GET] /v1/statuses?page=1&limit=10 
    */
    async getAll(req, res, next) {
        const filter = {
            sendEmail: req.query.sendEmail || false,
        };

        const sort = {};
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        const options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            sort,
            collation: { locale: 'en', strength: 2 }, // Case-insensitive sorting
        };

        const { docs, totalDocs, totalPages, limit, page, hasPrevPage, hasNextPage, prevPage, nextPage } =
            await Status.paginate(filter, options);

        return res.status(200).send({
            statuses: docs,
            totalStatuses: totalDocs,
            totalPages,
            limit,
            currentPage: page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        });
    }

    // [POST] /v1/statuses/addStatus
    async addStatus(req, res, next) {
        const { name } = req.body;

        // Check if user with provided email or phone already exists
        const existingStatusName = await Status.findOne({ name });

        if (existingStatusName) {
            return res.status(400).send({ message: 'Status name already exists' });
        }

        const savedStatus = await new Status(req.body).save();
        return res.status(201).send(savedStatus);
    }

    // [GET] /v1/statuses/:id
    async get(req, res, next) {
        const status = await Status.findById(req.params.id);
        if (status) {
            return res.status(200).send(status);
        } else {
            return res.status(404).send({ message: 'Status not found' });
        }
    }
}

module.exports = new StatusController();
