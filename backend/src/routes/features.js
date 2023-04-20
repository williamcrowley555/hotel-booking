const express = require('express');
const { uploadImage } = require('../config/multer');

const router = express.Router();

const featureController = require('../app/controllers/FeatureController');

const jwtMiddleware = require('../app/middlewares/jwtMiddleware');

router.get('/:id', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), featureController.get);
router.get('/', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), featureController.getAll);
router.post(
    '/',
    jwtMiddleware.verifyManagerToken.bind(jwtMiddleware),
    uploadImage.single('logo'),
    featureController.create,
);
router.patch('/:id/restore', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), featureController.restore);
router.patch(
    '/:id',
    jwtMiddleware.verifyManagerToken.bind(jwtMiddleware),
    uploadImage.single('logo'),
    featureController.update,
);
router.delete('/:id', jwtMiddleware.verifyManagerToken.bind(jwtMiddleware), featureController.delete);

module.exports = router;
