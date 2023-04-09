const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const EmailTempleteSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        emailSubject: {
            type: String,
            required: true,
            trim: true,
        },
        disabled: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

EmailTempleteSchema.methods.toJSON = function () {
    const emailTemplete= this;
    const emailTempleteObject = emailTemplete.toObject();
    return emailTempleteObject;
};

const EmailTemplete = mongoose.model('EmailTemplete', EmailTempleteSchema);

module.exports = EmailTemplete;
