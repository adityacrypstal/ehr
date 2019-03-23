const express = require('express');
const router = express.Router();
const ipfsAPI = require('ipfs-api');
const User = require('../models/User');
const BC = require('../controllers/blockchain');
const File = require('../controllers/file');
var moment = require('moment');
var today = new Date();
const date = moment(today).format('DD/MM/YYYY');
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
        } else {
            let hash = file[0].hash;
            BC.setAddr(userid, hash, (err, res) => {
                console.log(res);
            });

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
router.get('/getFile/:id', ensureAuthenticated, async (req, res) => {
    let userid = req.user._id.toString();
    BC.getAddr(userid, (err, data) => {
        var QM = req.params.id;
        ipfs.files.get(QM, function (err, files) {
            files.forEach((file) => {
                if (err) throw err;
                var record = file.content.toString('utf8')
                if (req.user.role) {
                    res.render('record', {
                        data: JSON.parse(record)
                    });
                } else {
                    res.render('edit', {
                        data: JSON.parse(record)
                    });
                }
            })
        })
    })
})
router.get('/getFile/', ensureAuthenticated, async (req, res) => {
    let userid = req.user._id.toString();
    BC.getAddr(userid, (err, data) => {
        var QM = data;
        ipfs.files.get(QM, function (err, files) {
            files.forEach((file) => {
                if (err) throw err;
                var record = file.content.toString('utf8')
                if (req.user.role) {
                    res.render('record', {
                        data: JSON.parse(record)
                    });
                } else {
                    res.render('edit', {
                        data: JSON.parse(record)
                    });
                }
            })
        })
    })
})
//need to reconstruct the function
router.post('/edit', ensureAuthenticated, async (req, res) => {
    var data = JSON.parse(req.body.user.current)
    let desc = req.body.user.desc;
    let presc = req.body.user.presc;
    let bp = req.body.user.bp;
    let bs = req.body.user.bs;
    let cmt = req.body.user.cmt;
    var record = { id: 1, date: date, description: desc, prescription: presc, BP: bp, BS: bs, Comment: cmt };
    data.record.push(record);
    var patient = req.session.current_patient;
    File.reEdit(req.session.current_patient, JSON.stringify(data))
        .then(async (success) => {
            //Reading file from computer
            var fileName = __dirname + '/../public/record/' + patient + '.json';
            let testFile = fs.readFileSync(fileName);
            //Creating buffer for ipfs function to add file to the system
            let newBuffer = new Buffer(testFile);
            await ipfs.files.add(newBuffer, function (err, file) {
                if (err) throw err;
                let hash = file[0].hash;
                BC.setAddr(patient, hash, (err, res) => {
                    if (err) throw err
                    console.log(res);
                });
            })
            //Deleting file
            await fs.unlinkSync(fileName, (err) => {
                if (err) throw err;
            });
            await res.send("<h1>Your response has been  recorded</h1>");
        })
        .catch(err => console.log(err))


})
module.exports = router;