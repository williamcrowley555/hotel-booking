const User = require('../models/User');

class MeController {
    // [GET] /v1/me
    async me(req, res, next) {
        return res.status(200).send(req.user);
    }

    // [PATCH] /v1/me
    async update(req, res, next) {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['email', 'phone', 'password', 'fullname', 'gender', 'dateOfBirth'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ message: 'Invalid updates!' });
        }

        if (updates.includes('email')) {
            const existingEmailUser = await User.findOne({
                email: req.body.email,
                _id: { $ne: req.user._id },
            });

            if (existingEmailUser) {
                return res.status(400).send({ message: 'User with provided email already exists' });
            }
        }

        if (updates.includes('phone')) {
            const existingPhoneUser = await User.findOne({
                phone: req.body.phone,
                _id: { $ne: req.user._id },
            });

            if (existingPhoneUser) {
                return res.status(400).send({ message: 'User with provided phone already exists' });
            }
        }

        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();

        return res.status(201).send(req.user);
    }
}

module.exports = new MeController();
