const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const fileupload = require("express-fileupload");
const session = require("express-session");
require("dotenv").config({
    path: './config/keys.env'
});
const generalRoutes = require("./routes/general");
const userRoutes = require("./routes/user");
const burrowRoutes = require("./routes/burrow");
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(fileupload());

// override with POST having ?_method=DELETE | ?_method=PUT
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, './public')));
//app.use(express.static("public"));

app.use(session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: true,
    saveUninitialized: true,
}))

app.use((req, res, next) => {
    if (req.session.userInfo != null)
        res.locals.user = req.session.userInfo;
    if (req.session.adminInfo != null)
        res.locals.admin_user = req.session.adminInfo;
    next();
})

//handlebars template engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//routes
app.use("/", generalRoutes);
app.use("/user", userRoutes);
app.use("/burrow", burrowRoutes);


//MongoDB connection
const MONGO_DB_URL = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@flipkeys-omagm.mongodb.net/${process.env.MONGO_DB_DATABASE_NAME}?retryWrites=true&w=majority`;
mongoose.connect(MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log(`Successfully connected to database...`);
    })
    .catch((err) => {
        console.log(`DB connection error: ${err}`);
    });


const PORT = process.env.PORT || 3000;
//Creates an Express Web Server that listens for incomin HTTP Requests
app.listen(PORT, () => {
    console.log(`Successfully connected to web-server...`);
});