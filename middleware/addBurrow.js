const burrow_record = require('../models/burrow_model');
const path = require('path');
const save_burrow = (req, res) => {
    let errors = [];
    const new_burrow = {
        title: req.body.addBurrow_name,
        price: req.body.addBurrow_price,
        location: req.body.addBurrow_location,
        description: req.body.addBurrow_description
    }
    if (req.files == null) {
        errors.push("Sorry you must upload a file")
    }
    else {
        if (req.files.burrowPic.mimetype.indexOf("image") == -1) {
            errors.push("Sorry you can only upload images : Example (jpg, gif, png) ")
        }
    }
    if (errors.length > 0) {
        res.render("burrow/addBurrow", {
            errors: errors,
            title: new_burrow.title,
            price: new_burrow.price,
            location: new_burrow.location,
            description: new_burrow.description
        })
    } else {
        const burrow = new burrow_record(new_burrow);
        burrow.save()
            .then(burrow => {
                req.files.burrowPic.name = `burrowPic_${burrow._id}${path.parse(req.files.burrowPic.name).ext}`
                req.files.burrowPic.mv(`public/img/uploads/${req.files.burrowPic.name}`)
                    .then(() => {
                        burrow_record.findByIdAndUpdate(burrow._id, {
                                burrowPic: req.files.burrowPic.name
                            })
                            .then(() => {
                                console.log(`File name was updated in the database`)
                                res.redirect("/user/profile")
                            })
                            .catch(err => console.log(`Error :${err}`));
                    })
                    .catch(err => console.log(`Failed to upload burrow picture: ${err}`));
                console.log(new_burrow);
            }).catch(err => console.log(`Failed to save burrow to DB: ${err}`))
    }
}
module.exports = save_burrow;