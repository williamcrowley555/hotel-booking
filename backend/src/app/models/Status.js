const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const validGenders = ['male', 'female'];
const allowedRoles = ['admin', 'manager', 'user'];

const StatusSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        icon: {
            type: Buffer,
        },
        color: {
            type: String,
            required: true,
            default: '#ffffff',
            validate: {
                validator: function (value) {
                    return validator.isHexColor(value)
                },
                message: (props) => `${props.value} is not a valid Hex color code!`,
            },
        },
        validatedOrder: {
            type: Boolean,
            required: true,
            default: false,
        },
        invoiceDowloadable: {
            type: Boolean,
            required: true,
            default: false,
        },
        statusHided: {
            type: Boolean,
            required: true,
            default: false,
        },
        sendEmail: {
            type: Boolean,
            required: true,
            default: false,
        },
        attachInvoice: {
            type: Boolean,
            required: true,
            default: false,
        },
        attachInvoice: {
            type: Boolean,
            required: true,
            default: false,
        },
        setAsPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
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
