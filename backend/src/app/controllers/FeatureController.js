const Feature = require('../models/Feature');
const path = require('path');
const url = require('url');
const { bucket } = require('../../config/firebase');
const { isImage } = require('../../util/multer');
const { uploadFileToStorage, deleteFileFromStorage } = require('../../util/firebase');

const imageFolder = 'feature-logo';

class FeatureController {
    /* 
        [GET] /v1/features
        [GET] /v1/features?sortBy=name:desc
        [GET] /v1/features?page=1&limit=10  
    */
    async getAll(req, res, next) {
        const sort = {};
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        const options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            sort,
            collation: { locale: 'vi', strength: 2 }, // Case-insensitive sorting
        };

        const { docs, totalDocs, ...pagination } = await Feature.paginate({}, options);

        return res.status(200).send({
            features: docs,
            totalFeatures: totalDocs,
            ...pagination,
        });
    }

    // [GET] /v1/features/:id
    async get(req, res, next) {
        const feature = await Feature.findOneWithDeleted({ _id: req.params.id });
        if (!feature) {
            return res.status(404).send({ message: 'Feature not found' });
        }

        return res.status(200).send(feature);
    }

    // [POST] /v1/features
    async create(req, res, next) {
        // Find existing feature with a case-insensitive name
        const existingFeature = await Feature.findOne({ name: new RegExp(req.body.name, 'i') });
        if (existingFeature) {
            return res.status(400).send({ message: 'Feature already exists' });
        }

        const file = req.file;
        // Check if a file was uploaded
        if (!file) {
            return res.status(400).send({ message: 'No file uploaded' });
        }

        const logoUrl = await uploadFileToStorage(bucket, imageFolder, file);

        const feature = new Feature({
            ...req.body,
            logo: logoUrl,
        });

        const savedFeature = await feature.save();

        return res.status(201).send(savedFeature);
    }

    // [PATCH] /v1/features/:id
    async update(req, res, next) {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'logo'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ message: 'Invalid updates!' });
        }

        const { id } = req.params;

        const feature = await Feature.findOneWithDeleted({ _id: id });

        if (!feature) {
            return res.status(404).send({ message: 'Feature not found' });
        }

        // Find a feature with a case-insensitive name
        const existingFeature = await Feature.findOne({ _id: { $ne: id }, name: new RegExp(req.body.name, 'i') });
        if (existingFeature) {
            return res.status(400).send({ message: 'Feature already exists' });
        }

        const file = req.file;
        let logoUrl;

        if (file) {
            if (!isImage(file)) {
                return res.status(400).send({ message: 'Invalid file format. Only images are allowed' });
            }

            const parsedUrl = url.parse(feature.logo);
            const oldFileName = path.basename(parsedUrl.pathname);

            // Upload the new logo and delete the old one
            logoUrl = await uploadFileToStorage(bucket, imageFolder, file);
            deleteFileFromStorage(bucket, imageFolder, oldFileName);
        }

        const updatedFeature = await Feature.findOneAndUpdate(
            { _id: id },
            {
                name: req.body.name ?? feature.name,
                logo: logoUrl ?? feature.logo,
            },
            {
                new: true,
            },
        );

        return res.status(201).send(updatedFeature);
    }

    // [PATCH] /features/:id/restore
    async restore(req, res, next) {
        const feature = await Feature.findOneDeleted({ _id: req.params.id });
        if (!feature) {
            return res.status(404).send({ message: 'Feature not found' });
        }

        // Find existing feature that is not deleted with a case-insensitive name
        const existingFeature = await Feature.findOne({ name: new RegExp(feature.name, 'i') });
        if (existingFeature) {
            return res.status(400).send({ message: 'Feature already exists' });
        }

        const restoredFeature = await feature.restore({ _id: req.params.id });
        if (!restoredFeature) {
            return res.status(500).send({ message: 'Restore feature failed' });
        }
        return res.status(200).send(restoredFeature);
    }

    // [DELETE] /v1/features/:id
    async delete(req, res, next) {
        const feature = await Feature.findOne({ _id: req.params.id });
        if (!feature) {
            return res.status(404).send({ message: 'Feature not found' });
        }

        await feature.delete();
        return res.status(200).send({ message: 'Feature deleted successfully' });
    }
}

module.exports = new FeatureController();
