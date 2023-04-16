const authRoute = require('./auth');
const userRoute = require('./users');
const meRoute = require('./me');
const featuresRoute = require('./features');

function route(app) {
    app.use('/v1/auth', authRoute);
    app.use('/v1/users', userRoute);
    app.use('/v1/me', meRoute);
    app.use('/v1/features', featuresRoute);
}

module.exports = route;
