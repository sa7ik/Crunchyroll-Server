const adminAuth = (req, res, next) => {
    console.log('Admin Auth Middleware');

    user_auth(req, res, () => {
        if (req.user && req.user.id === 'admin') {
            return next();
        } else {
            throw new Error("You are not authorized");
        }
    });
};

module.exports = { adminAuth };