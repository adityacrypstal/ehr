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

router.post('/fileRequest', ensureAuthenticated, (req, res) => {
    User.findOne({ "_id": req.body.id }, (err, user) => {
        if (err) {
            console.log(err);
        }
        let patient_id = user._id;
        let doctor_id = req.user._id;
        const newLog = new Logs({
            patient_id,
            doctor_id
        });
        newLog.save()
        .then((msg) => {
            let data = [{
                "patient": user,
                "doctor": req.user,
                "url":process.env.LOCAL+'/doctor/helloDoctor/'+msg._id
            }]
            gateway.requestFile(data)
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
        })
        .catch(err => console.log(err));
        
    });
});
router.get('/helloDoctor/:id',(req ,res)=>{
    Logs.findByIdAndUpdate(req.params.id, {
        $set: {
            status: true,
        }
    }, (err) => {
        if (err) throw err;
    }).then(
        console.log("Permission granted")
    );
    
})

module.exports = router;