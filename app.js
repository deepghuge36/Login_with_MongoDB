//jshint esversion:6
const express = require("express");
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require('express-session')
const passport = require('passport');

const app = express();

//passport config
require('./config/passport')(passport);

//DB config 
const db = require('./keys').MongoURI;

//connect to mongoose
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

//Ejs
app.use(expressLayouts);
app.set("view engine", 'ejs');

//bodyparse
app.use(express.urlencoded({ extended: false }));

//express sessionware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//globle vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//routes
app.use('/', require("./routes/index.js"));
app.use('/users', require("./routes/users.js"));



const PORT = process.env.PORT || 3000;
app.listen(3000, console.log(`server started on ${PORT}`));
