module.exports = {
    uploadFileToStorage: function (bucket, folder, file) {
        return new Promise((resolve, reject) => {
            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = folder ? `${folder}/${fileName}` : fileName;
            const bucketFile = bucket.file(filePath);

            const fileStream = bucketFile.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
                predefinedAcl: 'publicRead', // Make the file publicly accessible
            });

            fileStream.on('error', (err) => {
                console.error(err);
                reject('An error occurred while uploading the file');
            });

            fileStream.on('finish', async () => {
                const [url] = await bucketFile.getSignedUrl({
                    action: 'read',
                    expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // Set expiration to 1 year from now
                });

                resolve(url);
            });

            fileStream.end(file.buffer);
        });
    },
    deleteFileFromStorage: async function (bucket, folder, fileName) {
        const filePath = folder ? `${folder}/${fileName}` : fileName;
        const file = bucket.file(filePath);
        await file.delete();
    },
};
