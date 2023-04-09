const mongoose = require('mongoose');
const validator = require('validator');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

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
        setAsPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        emailTemplete: {
            type: Schema.Types.ObjectId,
            ref: 'EmailTemplete',
            required: false,
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

/*
StatusSchema.pre('save', function (next) {
    const status = this;

    if (status.isModified && status.sendEmail == false) {
      delete this.emailTemplate;
    }

    next();
});
*/

StatusSchema.methods.toJSON = function () {
    const status = this;
    const statusObject = status.toObject();
    return statusObject;
};

StatusSchema.plugin(mongoosePaginate);

const Status = mongoose.model('Status', StatusSchema);

module.exports = Status;
