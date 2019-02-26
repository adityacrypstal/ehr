const express = require('express');
const router = express.Router();
const ipfsAPI = require('ipfs-api');
const User = require('../models/User');
const passport = require('passport');//Auth package
const Blockchain = require('../models/Blockchain');
const { ensureAuthenticated } = require('../config/auth');

var fs = require('fs');//File System

//Connceting to the ipfs network via infura gateway
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

router.get('/addFile', ensureAuthenticated, async (req, res) => {
    //Reading file from computer
    var fileName = __dirname + '/../public/record/' + req.user._id + '.json';
    let testFile = fs.readFileSync(fileName);
    //Creating buffer for ipfs function to add file to the system
    let testBuffer = new Buffer(testFile);
    let userid = req.user._id;

     await ipfs.files.add(testBuffer, function (err, file) {
        if (err) {
            console.log(err);
        }else{
            let hash = file[0].hash ;
        const newRecord = new Blockchain({
            userid,
            hash
        });
        newRecord.save().then(
            console.log("File is safe")
        ).catch(err=>console.log(err))
   
        }
        
    })
    //Deleting file
    await fs.unlinkSync(fileName, (err) => {
        if (err) throw err;
    });
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            safe: true,
        }
    }, (err) => {
        if (err) throw err;
    });
    await res.redirect('/dashboard');
})
module.exports = router;