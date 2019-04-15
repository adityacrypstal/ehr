const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Logs = require('../models/Logs');
const Query = require('../controllers/queries');
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
            Query.notify(req.user._id)
            .then((notify)=>{
                res.render('dash', {
                    Docs,
                    user: req.user,
                    size: fileSizeInMegabytes,
                    notification:notify
                })
            })
            .catch((err) => console.log(err))
        }else{
            Query.requestedFile(req.user._id,(err,hash)=>{
                
                if (err) throw err;
                if(hash){
                    Query.getPatient(hash.patient,(err, patient)=>{
                        Query.getTests(patient._id)
                        .then((Docs) => {
                            if (patient){
                                req.session.current_patient = patient._id;
                            }
                            if (err) throw err;
                            res.render('dashboard', {
                                user: req.user,
                                files: hash.hash,
                                patient: patient,
                                docs:Docs
                            })
                        }).catch((err)=>console.log(err));
                        
                    })
                }else{
                    res.render('dashboard', {
                        user: req.user,
                        files: null,
                        docs:null,
                        patient: null,
                    })
                }
                
            });
            
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
router.get('/temporary', ensureAuthenticated, (req, res) => {

    res.render('temporary', {
        user: req.user
    })

});
router.get('/history', ensureAuthenticated, async (req, res) => {
    Query.notifications(req.user._id)
    .then((Logs)=>{
        res.render('tables', {
            user: req.user,
            logs:Logs
        })
    })
    .catch((err)=>console.log(err));
    
});