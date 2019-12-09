const express = require('express')
const router = express.Router();
const path = require('path');
const save_burrow = require("../middleware/addBurrow");
const burrow_record = require('../models/burrow_model');
const adminAccess = require('../middleware/admin_auth');
router.use(express.static(path.join(__dirname, '../public')));

router.get("/addBurrow", adminAccess, (req, res) => {
    res.render("burrow/addBurrow");
});

router.get("/view/:id", (req, res) => {
    burrow_record.findById(req.params.id)
        .then((burrow) => {
            res.render("burrow/burrowView", {
                burrowView: burrow
            })
        })
        .catch(err => console.log(`Could not find view: ${err}`))
});

router.get("/burrowList", (req, res) => {
    burrow_record.find({
            booked: false
        })
        .then((burrows) => {
            res.render("burrow/burrowList", {
                lists: burrows
            });
        })
        .catch(err => console.log(`Find burrows error: ${err}`));
});

router.post("/view/:id", (req, res) => {
    burrow_record.findById(req.params.id)
        .then((burrow) => {
            res.render("burrow/burrowView", {
                burrowView: burrow
            })
        })
        .catch(err => console.log(`Could not find view: ${err}`))
});

router.post("/book/:id", (req, res) => {
    burrow_record.findByIdAndUpdate(req.params.id, {
            booked: true
        })
        .then(() => {
            res.redirect("/burrow/burrowList")
        })
        .catch(err => console.log(`Could not update burrow: ${err}`))
});

router.post("/modify/:id", adminAccess, (req, res) => {
    burrow_record.findById(req.params.id)
        .then((burrow) => {

            res.render("burrow/modifyBurrow", {
                burrowView: burrow
            })
        })
        .catch(err => console.log(`Could not find view: ${err}`))
});

router.post("/burrowList", adminAccess, save_burrow);
router.put("/modify/saveBurrow/:id", adminAccess, (req, res) => {

    const errors = [];
    let get_burrow = {
        title: req.body.modify_burrowTitle,
        price: req.body.modify_burrowPrice,
        location: req.body.modify_burrowLocation,
        description: req.body.modify_burrowDescription
    };

    if (req.body.modify_burrowTitle != "" &&
        req.body.modify_burrowPrice != "" &&
        req.body.modify_burrowLocation != "Anywhere" &&
        req.body.modify_burrowDescription != "") {

        burrow_record.findByIdAndUpdate(req.params.id, get_burrow)
            .then(() => {
                res.redirect("/burrow/burrowList")
            })
            .catch(err => console.log(`Could not update burrow: ${err}`))
    } else {
        errors.push("All fields must be filled!")

        burrow_record.findById(req.params.id)
            .then((burrow) => {
                res.render(`burrow/modifyBurrow`, {
                    burrowView: burrow,
                    errors
                })
            })
            .catch(err => console.log(`Could not find view: ${err}`))
    }
});

router.delete("/delete/:id", adminAccess, (req, res) => {
    burrow_record.deleteOne({
            _id: req.params.id
        })
        .then(() => {
            res.redirect("/burrow/burrowList");
        })
        .catch(err => console.log(`Failed to delete : ${err}`));
});

module.exports = router;