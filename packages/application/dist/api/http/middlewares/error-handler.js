// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err, req, res, next) => {
    return res.status(err.httpCode || 500).json({
        status: err.statusCode || '500',
        message: err.message,
    });
};
