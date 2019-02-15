const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    msg:{
        type:String,
        required:false
    },
    addr:{
        type:String,
        required:true
    }
});
const Document = mongoose.model('Document',DocumentSchema);
module.exports = Document;