function errorHandler(err, req, res, next) {
    // Check if the error is a Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({ errors: err.errors });
    }

    console.error(err);

    return res.status(500).json({ error: 'An unexpected error occurred' });
}

module.exports = errorHandler;
