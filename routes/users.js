const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require("connect-flash");

//user Model
const User = require('../models/User')

//Login Page
router.get("/login", (req, res) => res.render('login'));

//Reegister Page
router.get("/register", (req, res) => res.render('register'));

//Register Handle
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check required field
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill all the field" });
  }
  //check password macthes or not
  if (password !== password2) {
    errors.push({ msg: "password not match" });
  }
  //check the password length
  if (password.length < 6) {
    errors.push({ msg: "password should be at least 6 charcter " });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //validation passed
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          //user exits
          errors.push({ msg: "Email is already registered" });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password,
            password2
          });
          //Hash password
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // set password to hashed
              newUser.password = hash;
              //save user
              newUser.save()
                .then(user => {//use the flash
                  req.flash('success_msg', "your now registered and log in")
                  res.redirect("/users/login");
                });
              //showing me erros
              // .catch (err => console.log(err))

            }));
        }
      })
  }
});

//Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'You Are Log Out Sccuessfully');
  res.redirect('/users/login');
})

module.exports = router;
