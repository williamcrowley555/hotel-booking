const User = require('../models/User');

class MeController {
    // [GET] /v1/me
    async me(req, res, next) {
        return res.status(200).send(req.user);
    }

    // [PATCH] /v1/me
    async update(req, res, next) {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['email', 'password', 'fullname', 'dateOfBirth'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ message: 'Invalid updates!' });
        }

        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();

        return res.status(201).send(req.user);
    }
}

module.exports = new MeController();
