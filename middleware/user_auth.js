const sessionAccess = (req, res, next) => {
    if (req.session.userInfo == null) {
        console.log(`Access denied ${req.session.userInfo}`);
        res.redirect("/user/login");
    } else {
        next();
    }
}
module.exports = sessionAccess;