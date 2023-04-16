module.exports = {
    isImage: function (file) {
        return /^image\/.+/.test(file.mimetype);
    },
};
