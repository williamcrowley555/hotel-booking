const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');
const validator = require('validator');

const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        imageURI: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (value) {
                    return validator.isURL(value);
                },
                message: 'Invalid URI',
            },
        },
        caption: {
            type: String,
            trim: true,
        },
        position: {
            type: Number,
            required: true,
            validate: {
                validator: function (value) {
                    return validator.isFloat(String(value), { min: 0 });
                },
                message: 'Position must be a positive number',
            },
        },
        cover: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// Numbering image position before saving
ImageSchema.pre('save', function (next) {
    const image = this;

    if (!image.isModified('position')) {
        return next();
    }

    const roomTypeId = image.parent()._id;

    RoomType.findById(roomTypeId).exec((err, roomType) => {
        if (err) {
            return next(err);
        }

        const images = roomType.images;

        // If position is not set, find the maximum position value
        if (!image.position) {
            image.position =
                images.reduce((maxPosition, img) => {
                    return img.position > maxPosition ? img.position : maxPosition;
                }, 0) + 1;
        } else {
            // If position is set, update the position of other images
            images.forEach((img) => {
                if (img._id.toString() !== image._id.toString() && img.position >= image.position) {
                    img.position += 1;
                }
            });

            roomType.save((err) => {
                if (err) {
                    return next(err);
                }
                next();
            });
        }
    });
});

const RoomTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        retailPrice: {
            type: Number,
            required: true,
            validate: {
                validator: function (value) {
                    return validator.isCurrency(value.toString(), { symbol: '₫', allow_negatives: false });
                },
                message: 'Invalid price format (VND)',
            },
        },
        operatingCost: {
            type: Number,
            required: true,
            validate: {
                validator: function (value) {
                    return validator.isCurrency(value.toString(), { symbol: '₫', allow_negatives: false });
                },
                message: 'Invalid price format (VND)',
            },
        },
        description: {
            type: String,
            trim: true,
        },
        images: {
            type: [ImageSchema],
            validate: {
                validator: function (images) {
                    const count = images.filter((img) => img.cover === true).length;
                    return count === 1;
                },
                message: 'Only one image can be set as cover',
            },
        },
        features: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Feature',
            },
        ],
        rooms: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Room',
                },
            ],
        },
        adultsOccupancy: {
            type: Number,
            min: 0,
            default: 0,
            required: true,
        },
        childrenOccupancy: {
            type: Number,
            min: 0,
            default: 0,
            required: true,
        },
        slug: {
            type: String,
            slug: 'name',
            unique: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// Add plugins
mongoose.plugin(slug);
RoomTypeSchema.plugin(mongoosePaginate);
RoomTypeSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: ['count', 'findOne'],
});

const RoomType = mongoose.model('RoomType', RoomTypeSchema);

module.exports = RoomType;
