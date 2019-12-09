const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const registration_schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    subscription: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "defaultPic.jpg"
    },
    country:{
        type: String
    },
    city: {
        type: String
    },
    address: {
        type: String
    },
    postalCode: {
        type: String
    },
     type: {
         type: String,
         default: "user"
     },
    date_created: {
        type: Date,
        default: Date.now()
    }
});
registration_schema.plugin(uniqueValidator);
registration_schema.pre("save", function (next) {
    //if modified is not true
if(!this.isModified('password')) return next();

if(this.password)
{
    bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(this.password, salt)
                .then(hash => {
                    this.password = hash
                    next();
                }).catch(err => console.log(`Hashing error : ${err}`))
        })
    
}})

const registration_model = mongoose.model("registration", registration_schema);
module.exports = registration_model;