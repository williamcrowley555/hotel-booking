const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const RefundStatusSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
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
        refunded: {
            type: Boolean,
            required: true,
            default: false,
        },
        denied: {
            type: Boolean,
            required: true,
            default: false,
        },
        //when refund request status changed
        sendEmailToCustomer: {
            type: Boolean,
            required: true,
            default: false,
        },
        emailTempleteToCustomer: {
            type: Schema.Types.ObjectId,
            ref: 'EmailTemplete',
            required: false,
        },
        //when refund request status changed
        sendEmailToAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        emailTempleteToAdmin: {
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

RefundStatusSchema.methods.toJSON = function () {
    const refundStatus = this;
    const refundStatusObject = refundStatus.toObject();
    return refundStatusObject;
};

const RefundStatus = mongoose.model('RefundStatus', RefundStatusSchema);

module.exports = RefundStatus;
