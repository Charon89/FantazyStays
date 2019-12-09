const user_record = require('../models/user_model');
const bcrypt = require('bcryptjs');
const userinfo_valid = (req, res, next) => {

    const email_regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const password_regexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    let registration_errors = {
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        birthday: ""
    };

    const new_user = {
        email: req.body.signup_email,
        first_name: req.body.signup_fname,
        last_name: req.body.signup_lname,
        password: req.body.signup_password,
        birthdate: req.body.signup_birth,
        subscription: req.body.signup_subscription
    }
    if (req.body.signup_subscription == "on")
        new_user.subscription = "on";
    else
        new_user.subscription = "off";

    if (req.body.signup_email == "") {
        registration_errors.email = "E-mail address required"
    }
    if (email_regexp.test(req.body.signup_email) == false && req.body.signup_email != "") {
        registration_errors.email = "Not valid E-mail"
    }
    if (req.body.signup_fname == "") {
        registration_errors.first_name = "First name required"
    }
    if (req.body.signup_lname == "") {
        registration_errors.last_name = "Last name required"
    }
    if (req.body.signup_password == "") {
        registration_errors.password = "Password required"
    }
    if (req.body.signup_password != "" && req.body.signup_password != req.body.signup_password_confirm){
        registration_errors.password = "Password doesn't match";
    }

    if (password_regexp.test(req.body.signup_password) == false && req.body.signup_password != "") {
        registration_errors.password = "Password should contain at least one digit, one lower and upper case letter and not less then 8 characters";
    }
    if (req.body.signup_birth == "") {
        registration_errors.birthday = "Day of birth required"
    }
    /*************END SERVER SIDE VALIDATION *******************/
    if (registration_errors.email.length == 0 &&
        registration_errors.first_name.length == 0 &&
        registration_errors.last_name.length == 0 &&
        registration_errors.password.length == 0 &&
        registration_errors.birthday.length == 0) {

        const user = new user_record(new_user)
        user.save()
            .then(() => {
                console.log(`New tier ${new_user.first_name} was added to the database`);
                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                    to: new_user.email,
                    from: 'FantasyStays@no-resopnd.com',
                    subject: 'Welcome to Fantasy Stays!',
                    text: ` `,
                    html: `<strong>Hello ${new_user.first_name}!</strong><p>Thank you for singning for our services.</p><p>We are looking forward to see you using our services</p>
                    <p> This email is generated automatically, and does not accept replies. </p> <strong>Regards,</strong><br>Fantasy Stays Team`,
                };
                sgMail.send(msg)
                    .then(() => {
                        console.log(`E-mail was sent successfully on ${new_user.email}`);
                    })
                    .catch(err => console.log(`Send mail error : ${err} object ${new_user.email} ${new_user.first_name}`));
                res.render("./users/login");
            }).catch(err => console.log(`User object SAVING error: ${err}`, registration_errors.email = "This e-mail already exists", res.render("users/signup", {
                message: registration_errors,
                r_last_name: req.body.signup_lname,
                r_first_name: req.body.signup_fname,
                r_date_of_birth: req.body.signup_birth
            })))
    } else {
        res.render("users/signup", {
            message: registration_errors,
            r_last_name: req.body.signup_lname,
            r_first_name: req.body.signup_fname,
            r_password: req.body.signup_password,
            r_date_of_birth: req.body.signup_birth
        })
    }
};

module.exports = userinfo_valid;