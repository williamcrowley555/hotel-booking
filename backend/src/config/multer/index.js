const multer = require('multer');

module.exports = {
    uploadImage: multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 5 * 1024 * 1024, // 5 MB
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Invalid file format. Only image files are allowed'));
            }
        },
    }),
};
