const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const RoomStatusSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

// Add plugins
RoomStatusSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

const RoomStatus = mongoose.model('RoomStatus', RoomStatusSchema);

module.exports = RoomStatus;
