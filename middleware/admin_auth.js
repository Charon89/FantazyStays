const sessionAccess = (req, res, next) => {
    if (req.session.adminInfo == null) {
        console.log(`Access denied ${req.session.adminInfo}`);
        res.redirect("/user/login");
    } else {
        next();
    }
}
module.exports = sessionAccess;