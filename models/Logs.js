const mongoose = require('mongoose');
var moment = require('moment');
var today = new Date();

const date = moment(today).format('DD/MM/YYYY HH:mm'); 

const LogsSchema = new mongoose.Schema({
    patient_id:{
        type:String,
        required:true
    },
    doctor_id:{
        type:String,
        required:true
    },
    doctor_name:{
        type:String,
        required:true
    },
    time:{
        type:String,
        default:date
    },
    status:{
        type:Boolean,
        default:false
    }
});
const Logs = mongoose.model('Logs',LogsSchema);
module.exports = Logs;