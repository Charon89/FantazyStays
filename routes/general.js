const express = require('express')
const router = express.Router();
const burrow_record = require('../models/burrow_model');
router.get("/", (req, res) => {
    res.render("general/index");
});

router.get("/about", (req, res) => {
    res.render("general/about");
});

router.post("/", (req, res) => {
    const errors = [];
    if (req.body.search_checkinDate == "" &&
        req.body.search_checkoutDate == "") {
        errors.push(`All fields must be filled...`);
        res.render('general/index', {
            errors
        })
    } else {
        if (req.body.search_where == "Anywhere" && errors.length <= 0) {
            burrow_record.find()
                .then((burrows) => {
                    res.render(`burrow/burrowsFound`, {
                        lists: burrows
                    })
                })
                .catch(err => console.log(`Find error ${err}`))
        } else {
            burrow_record.find({
                    location: req.body.search_where
                })
                .then((burrows) => {
                    res.render(`burrow/burrowsFound`, {
                        lists: burrows
                    })
                })
                .catch(err => console.log(`Find error ${err}`))
        }
    }    
})

router.get("/burrow", (req, res) => res.render("./burrow/burrowList"));
module.exports = router;