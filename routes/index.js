const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Document = require('../models/Document');

router.get('/',(req, res) => res.render('welcome'));
module.exports = router;

router.get('/dashboard',ensureAuthenticated, (req, res)=>{
    Document.find({"user":req.user._id}).then((Docs)=>{
        res.render('dash', {
            Docs,
            user: req.user
          })
    }),(e)=>{
        res.send('error');
    }
    
});
router.get('/profile',ensureAuthenticated, (req, res)=>{

    res.render('user', {
        user: req.user
      })
      
});
router.get('/history',ensureAuthenticated, (req, res)=>{
    res.render('tables', {
        user: req.user
      })
});