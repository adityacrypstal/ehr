const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    blood:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    safe:{
        type:Boolean,
        default:false,
    }
});
const User = mongoose.model('User',UserSchema);
module.exports = User;