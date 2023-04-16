const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseDelete = require('mongoose-delete');
const validator = require('validator');

const Schema = mongoose.Schema;

const FeatureSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        logo: {
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
    },
    {
        timestamps: true,
    },
);

// Add plugins
FeatureSchema.plugin(mongoosePaginate);
FeatureSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: ['count', 'findOne'],
});

const Feature = mongoose.model('Feature', FeatureSchema);

module.exports = Feature;
