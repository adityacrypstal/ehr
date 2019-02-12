const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');


router.get('/',(req, res) => res.render('welcome'));
module.exports = router;

router.get('/dashboard',ensureAuthenticated, (req, res)=>{
    res.render('dash', {
        user: req.user
      })
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