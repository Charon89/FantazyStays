const express = require('express')
const router = express.Router();
const path = require('path');
const userinfo_valid = require("../middleware/signup_validation");
const login_valid = require("../middleware/login_validation");
const sessionAccess = require("../middleware/user_auth");
const user_record = require('../models/user_model');

router.use(express.static(path.join(__dirname, '../public')));


router.get("/login", (req, res) => {
    res.render("users/login");
});

router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.get("/profile", (req, res) => {
    res.render("users/profile");
});

router.get("/profile/edit", (req, res) => {
    res.render("./users/profile_edit");
});

router.put("/profile/edit/:id", (req, res) => {
    const errors = [];
    const same = (req.session.userInfo == req.body.signup_email || req.session.adminInfo == req.body.signup_email) ? true : false;
    console.log(same);

    if (req.files == null) {
        errors.push("Sorry you must upload a file")
    } else { //file is not an image
        if (req.files.profilePic.mimetype.indexOf("image") == -1) {
            errors.push("Sorry you can only upload images : Example (jpg,gif, png) ")
        }
    }

    if (errors.length > 0) {
        res.render("users/profile_edit", {
            errors: errors
        })
    } else {

        if (req.session.userInfo != null) {

            req.files.profilePic.name = `profile_${req.session.userInfo._id}${path.parse(req.files.profilePic.name).ext}`;
            req.files.profilePic.mv(`public/img/uploads/${req.files.profilePic.name}`)

            user_record.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    email: req.body.signup_email,
                    first_name: req.body.signup_fname,
                    last_name: req.body.signup_lname,
                    country: req.body.signup_country,
                    city: req.body.signup_city,
                    address: req.body.signup_address,
                    postalCode: req.body.signup_postalCode,
                    profilePic: req.files.profilePic.name
                }, {
                    new: true
                })
                .then((newData) => {
                    req.session.userInfo.email = newData.email;
                    req.session.userInfo.first_name = newData.first_name;
                    req.session.userInfo.last_name = newData.last_name;
                    req.session.userInfo.country = newData.country;
                    req.session.userInfo.address = newData.address;
                    req.session.userInfo.postalCode = newData.postalCode;
                    if (newData.profilePic != null)
                        req.session.userInfo.profilePic = newData.profilePic;
                    console.log(req.session.userInfo);
                    res.redirect("/user/profile");
                })
                .catch((err) => {
                    console.log(`Find and update user error : ${err}`);
                    errors.push(`This email already exists`);
                    res.render("users/profile_edit", {
                        errors
                    });
                });
        } else {
            req.files.profilePic.name = `profile_${req.session.adminInfo._id}${path.parse(req.files.profilePic.name).ext}`
            req.files.profilePic.mv(`public/img/uploads/${req.files.profilePic.name}`)
            user_record.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    email: req.body.signup_email,
                    first_name: req.body.signup_fname,
                    last_name: req.body.signup_lname,
                    country: req.body.signup_country,
                    city: req.body.signup_city,
                    address: req.body.signup_address,
                    postalCode: req.body.signup_postalCode,
                    profilePic: req.files.profilePic.name
                }, {
                    new: true
                })
                .then((newData) => {
                    req.session.adminInfo.email = newData.email;
                    req.session.adminInfo.first_name = newData.first_name;
                    req.session.adminInfo.last_name = newData.last_name;
                    req.session.adminInfo.country = newData.country;
                    req.session.adminInfo.address = newData.address;
                    req.session.adminInfo.postalCode = newData.postalCode;
                    req.session.adminInfo.profilePic = newData.profilePic;
                    console.log(req.session.adminInfo);
                    res.redirect("/user/profile");
                })
                .catch((err) => {
                    console.log(`Find and update user error : ${err}`);
                    errors.push(`This email already exists`);
                    res.render("users/profile_edit", {
                        errors
                    });
                });
        }
    }

});
router.post("/signup", userinfo_valid);
router.post("/profile", login_valid, sessionAccess);
router.post("/edit", sessionAccess);
router.post("/login", login_valid);

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("login");
});

module.exports = router;