const mongoose = require('mongoose');

const BlockchainSchema = new mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    hash:{
        type:String,
        required:true
    },
    time:{
        type:String,
        default:new Date().getTime()
    }
});
const Blockchain = mongoose.model('Blockchain',BlockchainSchema);
module.exports = Blockchain;