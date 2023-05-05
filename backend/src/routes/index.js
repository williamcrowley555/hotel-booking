const authRoute = require('./auth');
const userRoute = require('./users');
const meRoute = require('./me');
const featureRoute = require('./features');
const roomStatusRoute = require('./roomStatuses');
const roomRoute = require('./rooms');
const roomTypeRoute = require('./roomTypes');

function route(app) {
    app.use('/v1/auth', authRoute);
    app.use('/v1/users', userRoute);
    app.use('/v1/me', meRoute);
    app.use('/v1/features', featureRoute);
    app.use('/v1/room-statuses', roomStatusRoute);
    app.use('/v1/rooms', roomRoute);
    app.use('/v1/room-types', roomTypeRoute);
}

module.exports = route;
