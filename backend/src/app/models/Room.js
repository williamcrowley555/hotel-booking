const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseDelete = require('mongoose-delete');
const validator = require('validator');

const Schema = mongoose.Schema;

const RoomSchema = new Schema(
    {
        roomNo: {
            type: String,
            required: true,
            trim: true,
        },
        floor: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: Schema.Types.ObjectId,
            ref: 'RoomStatus',
        },
        extraInfo: {
            type: String,
            trim: true,
        },
        roomType: {
            type: Schema.Types.ObjectId,
            ref: 'RoomType',
        },
        disableDates: [
            {
                dateFrom: {
                    type: Date,
                    required: true,
                },
                dateTo: {
                    type: Date,
                    required: true,
                    validate: {
                        validator: function (value) {
                            return validator.isAfter(value, this.disableDates.dateFrom);
                        },
                        message: 'Date To must be after Date From',
                    },
                },
                reason: {
                    type: String,
                    trim: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    },
);

// Add plugins
RoomSchema.plugin(mongoosePaginate);
RoomSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: ['count', 'findOne'],
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
