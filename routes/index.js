const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Document = require('../models/Document');
var fs = require('fs');//File System

router.get('/', (req, res) => res.render('welcome'));
module.exports = router;

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Document.find({ "user": req.user._id }).then((Docs) => {
        fileName = __dirname + '/../public/record/' + req.user._id + '.json';
        if (!fs.existsSync(fileName)) {
            var fileSizeInMegabytes = 0;
            console.log("File not found");
        } else {
            const stats = fs.statSync(fileName);
            const fileSizeInBytes = stats.size;
            var fileSizeInMegabytes = (fileSizeInBytes / 1000000.0) * 100; 
        }
        res.render('dash', {
            Docs,
            user: req.user,
            size: fileSizeInMegabytes
        })
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
    res.render('tables', {
        user: req.user
    })
});