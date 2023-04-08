const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const allowedRoles = ['admin', 'manager', 'user'];

const UserSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: {
                validator: function (value) {
                    return validator.isEmail(value);
                },
                message: 'Email is invalid',
            },
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (value) {
                    return validator.isMobilePhone(value, 'vi-VN');
                },
                message: (props) => `${props.value} is not a valid phone number for Vietnam!`,
            },
        },
        password: {
            type: String,
            required: true,
            min: 6,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return validator.isBefore(value.toISOString(), new Date().toISOString());
                },
                message: 'Invalid date of birth',
            },
        },
        disabled: {
            type: Boolean,
            required: true,
            default: false,
        },
        role: {
            type: String,
            default: 'user',
            validate: {
                validator: function (value) {
                    return allowedRoles.includes(value);
                },
                message: 'Invalid user role',
            },
        },
        accessTokens: [
            {
                accessToken: {
                    type: String,
                    required: true,
                },
            },
        ],
        refreshTokens: [
            {
                refreshToken: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    },
);

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.accessTokens;
    delete userObject.refreshTokens;

    return userObject;
};

UserSchema.methods.generateAuthTokens = async function () {
    const user = this;
    const accessToken = jwt.sign({ _id: user._id.toString() }, process.env.JWT_ACCESS_KEY, {
        expiresIn: '5m',
    });
    const refreshToken = jwt.sign({ _id: user._id.toString() }, process.env.JWT_REFRESH_KEY, {
        expiresIn: '30d',
    });

    user.accessTokens = user.accessTokens.concat({ accessToken });
    user.refreshTokens = user.refreshTokens.concat({ refreshToken });
    await user.save();

    return { accessToken, refreshToken };
};

UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Wrong email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Wrong email or password');
    }

    return user;
};

// Hash the plain text password before saving
UserSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    next();
});

// Add plugins
UserSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', UserSchema);

module.exports = User;
