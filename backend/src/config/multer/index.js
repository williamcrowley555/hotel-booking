const multer = require('multer');

module.exports = {
    uploadImage: multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 5 * 1024 * 1024, // 5 MB
        },
    }),
};
