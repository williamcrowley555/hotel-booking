const Status = require('../models/Status');

class StatusController {
    /* 
        [GET] /v1/statuses
        [GET] /v1/statuses?sendEmail=true
        [GET] /v1/statuses?sortBy=createdAt:desc
        [GET] /v1/statuses?page=1&limit=10 
    */

    // [GET] /v1/statuses/:id
    async getOne(req, res, next) {
        const status = await Status.findOne({_id: req.params.id});
        if (status) {
            return res.status(200).send(status);
        } else {
            return res.status(404).send({ message: 'Status not found' });
        }
    }

    // [GET] /v1/statuses/
    async getAll(req, res, next) {
        const filter = {
            sendEmail: req.query.sendEmail || false,
            deleted: false, // add filter to exclude deleted statuses
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
    async add(req, res, next) {
        const { name } = req.body;

        // Check if status name already exists
        const existingStatusName = await Status.findOne({ name });

        if (existingStatusName) {
            return res.status(400).send({ message: 'Status name already exists' });
        }

        const savedStatus = await new Status(req.body).save();
        return res.status(201).send(savedStatus);
    }

    // [PATCH] /v1/statuses/:id
    async update(req, res, next) {
            const _id = req.params.id
            const {__v, ...status } = req.body;
            const updatedStatus = await Status.findOneAndUpdate(
                { _id, __v },
                { ...status, updatedAt: new Date(), $inc: { __v: 1 } },
                { new: true }
            )

            if (!updatedStatus) {
                return res.status(400).send({ message: 'Status not exist or already be changed '});
            }

            return res.status(201).send(updatedStatus);
    }

    async updateStatusNonAtomic(req, res, next) {
        // Check if status id exist and correct version before update
        Status.findOne({_id: req.body._id, __v: req.body.__v})
        .then((status) => {
            if (!status){
                return res.status(400).send({ message: 'Status not exist or already be changed '});
            }
            status.set({...req.body})
            status.__v++
            status.save((err, updatedStatus) => {
                if (err) {
                  return res.status(500).send({ message: 'Error while updating status', error: err });
                }
                return res.status(201).send(updatedStatus);
              });
        })
    }

   

    // [DELETE] /v1/statuses/:id
    destroy(req, res, next) {
        Status.findById(req.params.id)
        .then(status => {
            if (!status) {
                return res.status(404).json({ message: "Status not found" });
            }

            status.__v++
            status.delete()
                .then(() => {
                    res.status(200).json({ message: "Status deleted successfully" });
                })
                .catch(next);
        })
        .catch(next);
    }

    // [PATCH] /v1/statuses/:id/restore
    restore(req, res, next) {
        Status.findDeleted({_id: req.params.id})
        .then(status => {
            if (!status) {
                return res.status(404).json({ message: "Deleted Status not found" });
            }
            
            Status.restore({_id: req.params.id})
            .then(() => {
                return Status.findOneAndUpdate({_id: req.params.id}, {deletedAt: null}, {new: true});
            })
            .then((restoredStatus) => {
                res.status(200).json({ message: "Status restored successfully", status: restoredStatus });
            })
            .catch(next);
        })
        .catch(next);
    }
}

module.exports = new StatusController();
