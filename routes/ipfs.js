const express = require('express');
const router = express.Router();
const ipfsAPI = require('ipfs-api');
const User = require('../models/User');
const passport = require('passport');//Auth package
const { ensureAuthenticated } = require('../config/auth');

var fs = require('fs');//File System

//Connceting to the ipfs network via infura gateway
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

router.get('/addFile', ensureAuthenticated, (req, res) => {
    //Reading file from computer
    var fileName = __dirname + '/../public/record/' + req.user._id + '.json';
    let testFile = fs.readFileSync(fileName);
    //Creating buffer for ipfs function to add file to the system
    let testBuffer = new Buffer(testFile);
    ipfs.files.add(testBuffer, function (err, file) {
        if (err) {
            console.log(err);
        }
        console.log(file)
    })
    //Deleting file
    fs.unlinkSync(fileName, (err) => {
        if (err) throw err;
    });
    User.findByIdAndUpdate(req.user._id, {
        $set: {
            safe:  true,
        }
    }, (err)=>{
        if (err) throw err;
    });
    res.redirect('/dashboard');
})
module.exports = router;