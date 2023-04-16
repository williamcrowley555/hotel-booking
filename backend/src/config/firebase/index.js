const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.BUCKET_NAME,
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
