const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function connect() {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URL).then(() => console.log('Connect db successfully !!!'));
    } catch (error) {
        console.log('Connect db failure !!!');
    }
}

module.exports = { connect };
