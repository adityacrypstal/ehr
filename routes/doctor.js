const express = require('express');
const file = require('../controllers/file.js');
const gateway = require('../controllers/gateway.js');
const { ensureAuthenticated } = require('../config/auth');

const router = express.Router();
const bcrypt = require('bcryptjs');//Hashing package
const passport = require('passport');//Auth package

// Load User model
const User = require('../models/User');
const Logs = require('../models/Logs');



//Routing starts
router.get('/', (req, res) => res.render('welcome'));
//Doctor requesting patient
router.post('/fileRequest', ensureAuthenticated, (req, res) => {
    User.findOne({ "_id": req.body.id }, (err, user) => {
        if (err) {
            console.log(err);
        }
        if(user){
            let patient_id = user._id;
        let doctor_id = req.user._id;
        let doctor_name =req.user.fname+' '+req.user.lname;
        const newLog = new Logs({
            patient_id,
            doctor_id,
            doctor_name
        });
        newLog.save()
            .then((msg) => {
                let data = [{
                    "patient": user,
                    "doctor": req.user,
                    "url": process.env.LOCAL + '/doctor/helloDoctor/' + msg._id
                }]
                gateway.requestFile(data)
                    .then((des) => {console.log(des);res.redirect('/dashboard')})
                    .catch((err) => console.log(err))
            })
            .catch(err => console.log(err));
        }else{
            res.redirect('/dashboard')
        }
        
    });
});
//Patient approving doctor request
router.get('/helloDoctor/:id', (req, res) => {
    Logs.findByIdAndUpdate(req.params.id, {
        $set: {
            status: true,
        }
    }, (err) => {
        if (err) throw err;
    }).then(
        res.send("<h1>Thank you ! Permission granted.</h1>")

    );

})
//Remove available files from doctor panel
router.get('/removefile', ensureAuthenticated, (req, res) => {
    var myquery = { doctor_id: req.user._id, status: true};
    var newvalues = { $set: { status: false } };
    Logs.updateOne(myquery, newvalues, { sort: { 'time': -1 } }, function (err, res) {
        if (err) throw err;
    })
    .then(des => {
        delete req.session.current_patient;
        res.redirect('/dashboard')
    } )
    .catch(err => console.log(err));
});

module.exports = router;