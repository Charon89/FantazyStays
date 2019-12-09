const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const burrowSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    burrowPic: {
        type: String
        
    },
    booked:{
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("burrow", burrowSchema);