const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next() ;

    return res.redirect('/user/login');
};

const checkNotAuth = (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect('/') ;

    return next();
};

module.exports.checkAuth = checkAuth;
module.exports.checkNotAuth = checkNotAuth;