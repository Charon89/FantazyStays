const user_record = require('../models/user_model');
const bcrypt = require('bcryptjs');

const login_valid = (req, res) => {
    const email_regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const password_regexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    /*************SERVER SIDE VALIDATION *******************/
    let login_errors = {
        email: "",
        password: "",
    };

    if (req.body.login_email == "") {
        login_errors.email = "E-mail address required"
    }
    if (email_regexp.test(req.body.login_email) == false && req.body.login_email != "") {
        login_errors.email = "Not valid E-mail"
    }
    if (req.body.login_password == "") {
        login_errors.password = "Password required"
    }
    if (password_regexp.test(req.body.login_password) == false && req.body.login_password != "") {
        login_errors.password = "Password should contain at least one digit, one lower and upper case letter and not less then 8 characters";
    }


    if (login_errors.email.length == 0 && login_errors.password.length == 0) {
        const errors = [];
        const formData = {
            email: req.body.login_email,
            password: req.body.login_password
        }
        user_record.findOne({
                email: formData.email
            })
            .then(user => {
                //No email in DB
                if (user == null) {
                    errors.push("Sorry your email was not found");
                    res.render("users/login", {
                        errors: errors
                    })
                }
                //email found in DB
                else {
                    bcrypt.compare(formData.password, user.password)
                        .then(isMatched => {

                            if (isMatched == true) {
                                if (user.type == "user")
                                    req.session.userInfo = user;
                                 if (user.type == "admin")
                                     req.session.adminInfo = user;
                                res.redirect("profile")
                            } else {
                                errors.push("Sorry, your password does not match");
                                res.render("users/login", {
                                    errors: errors
                                })
                            }
                        })
                        .catch(err => console.log(`Match error: ${err}`));
                }
            })
            .catch(err => console.log(`Find error: ${err}`));

    } else {
        res.render("users/login", {

            message: login_errors,
            r_email: req.body.login_email
        })
    }
};

module.exports = login_valid;