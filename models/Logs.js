const mongoose = require('mongoose');

const LogsSchema = new mongoose.Schema({
    patient_id:{
        type:String,
        required:true
    },
    doctor_id:{
        type:String,
        required:true
    },
    time:{
        type:String,
        default:new Date().getTime()
    },
    status:{
        type:Boolean,
        default:false
    }
});
const Logs = mongoose.model('Logs',LogsSchema);
module.exports = Logs;