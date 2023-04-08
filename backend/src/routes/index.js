const authRoute = require('./auth');
const userRoute = require('./users');
const meRoute = require('./me');
const availableTimeRoute = require('./availableTimes');
const tableRoute = require('./tables');

function route(app) {
    app.use('/v1/auth', authRoute);
    app.use('/v1/users', userRoute);
    app.use('/v1/me', meRoute);
}

module.exports = route;
