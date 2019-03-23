const express = require('express');
const router = express.Router();
const multer = require('multer');
// Load User model
const User = require('../models/User');
const Document = require('../models/Document');
const path = require('path');
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

                var addr = '/uploads/'+req.file.filename;
                const{type, msg} = req.body;
                const user = req.user._id;
                const newDocument = new Document({
                    user,
                    type,
                    msg,
                    addr
                });
                newDocument.save()
                .then(res.redirect('/dashboard'))
                .catch(err => console.log(err));
            }
        }
    });

})

module.exports = router;