const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const errorHandlerMiddleware = require('./app/middlewares/errorHandlerMiddleware');

// Use express-async-errors to handle errors in async route handlers
require('express-async-errors');

dotenv.config();

const app = express();

const route = require('./routes');
const db = require('./config/db');

// Connect to db
db.connect();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// HTTP logger
// app.use(morgan("combined"));

// Routes init
route(app);

app.use(errorHandlerMiddleware);

app.listen(process.env.BACKEND_PORT, () => {
    console.log(`App listening on port ${process.env.BACKEND_PORT}`);
});
