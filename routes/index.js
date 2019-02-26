const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Logs = require('../models/Logs');
const Document = require('../models/Document');
var fs = require('fs');//File System

router.get('/', (req, res) => res.render('welcome'));
module.exports = router;

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Document.find({ "user": req.user._id }).then((Docs) => {
        fileName = __dirname + '/../public/record/' + req.user._id + '.json';
        if (!fs.existsSync(fileName)) {
            var fileSizeInMegabytes = 0;
        } else {
            const stats = fs.statSync(fileName);
            const fileSizeInBytes = stats.size;
            var fileSizeInMegabytes = (fileSizeInBytes / 1000000.0) * 100; 
        }
        if(req.user.role){
            res.render('dash', {
                Docs,
                user: req.user,
                size: fileSizeInMegabytes
            })
        }else{
            res.render('dashboard', {
                user: req.user,
            })
        }
    }), (e) => {
        res.send('error');
    }

});
router.get('/profile', ensureAuthenticated, (req, res) => {

    res.render('user', {
        user: req.user
    })

});
router.get('/history', ensureAuthenticated, (req, res) => {
    Logs.find({"patient_id":req.user.id}).then((Logs) =>{
        res.render('tables', {
            user: req.user,
            logs:Logs
        })
    }).catch(err => console.log(err));
});