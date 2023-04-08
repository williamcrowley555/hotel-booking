const User = require('../models/User');

class UserController {
    /* 
        [GET] /v1/users
        [GET] /v1/users?role=user
        [GET] /v1/users?sortBy=createdAt:desc
        [GET] /v1/users?page=1&limit=10 
    */
    async getAll(req, res, next) {
        const filter = {};
        const { role } = req.query;

        filter.role = role !== undefined ? role : 'user';

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
            await User.paginate(filter, options);

        return res.status(200).send({
            users: docs,
            totalUsers: totalDocs,
            totalPages,
            limit,
            currentPage: page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        });
    }

    // [GET] /v1/users/:id
    async get(req, res, next) {
        const user = await User.findById(req.params.id);
        if (user) {
            return res.status(200).send(user);
        } else {
            return res.status(404).send({ message: 'User not found' });
        }
    }
}

module.exports = new UserController();
