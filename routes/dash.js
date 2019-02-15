const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const multer = require('multer');
// Load User model
const User = require('../models/User');

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }

}).single('docs');



router.post('/upload_doc', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.send('Error')
        } else {
            if (req.file == undefined) {
                res.send('No file selected')
            } else {
                res.send(re.file.fieldname);
            }
        }
    });

})

module.exports = router;