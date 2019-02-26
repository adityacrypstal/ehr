const express = require('express');
const file = require('../controllers/file.js');
const gateway = require('../controllers/gateway.js');
const router = express.Router();
const bcrypt = require('bcryptjs');//Hashing package
const passport = require('passport');//Auth package

// Load User model
const User = require('../models/User');



//Routing starts
router.get('/', (req, res) => res.render('welcome'));

router.get('/login', (req, res) => res.render('login'));

router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
  let errors = [];
  const { role, fname, lname, phone, address, email, age, blood, gender, password, password2 } = req.body;

  // Registration validation starts here
  if (!fname || !lname || !email || !password || !password2 || !phone || !blood || !gender || !age || !address) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {errors, fname, lname, address, phone, age, gender, blood, email, password, password2 });
  } else {
    // User.findOne({ email: email }).then(user => {
    //   if (user) {
    //     errors.push({ msg: 'Email already exists' });
    //     res.render('register', {
    //       errors, fname, lname, address, phone, age, gender, blood, email, password, password2 });
    //   } else {
        //Creates User in model
        const newUser = new User({ role, fname, lname, phone, address, email, age, blood, gender, password });
        //Hashes password and compare pass1 with pass2
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                //Registration action starts here
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                gateway.registration(user)
                  .then((gateway) => {
                    if(user.role){
                      file.createFile(user)
                      .then((file) => {
                        console.log(gateway, file);
                      })
                      .catch((err) => console.log(err))
                    }
                  })
                  .catch((err) => console.log(err));
                res.redirect('/user/login');
              })
              .catch(err => console.log(err));
            //Registration action ends here
            });
        });
    //   }
    // });
  }
});
//Passport login procedure
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash: true
  })(req, res, next);
});
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/user/login');
});
module.exports = router;