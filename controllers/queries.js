const express = require('express');
// const Blockchain = require('../models/Blockchain');
const BC = require('../controllers/blockchain');
const User = require('../models/User');
const Logs = require('../models/Logs');
const Document = require('../models/Document'); 


//Call for file using join method
const requestedFile = (userId, callback) => {
    Logs.findOne({ "doctor_id": userId, "status": true })
        .then(res => {
            let patient_id = res.patient_id;
            BC.getAddr(patient_id,(err, res)=>{
                
                callback(null, {hash:res,patient:patient_id});
            })

        })
        .catch(err => callback(null, null));
}
const getPatient = (patient_id, callback)=>{
    User.findOne({
        "_id":patient_id
    }).then(patient=>{
        callback(null, patient)
    }).catch(error=>{
        callback(null, null)
    })
}
const notifications = (user_id) =>{
    return new Promise((resolve, reject)=>{
        Logs.find({"patient_id":user_id}).then((Logs) =>{
            resolve(Logs);
        }).catch(err => reject(err));
    })
}
const notify = (user_id)=>{
    return new Promise((resolve, reject)=>{
        Logs.find({"patient_id":user_id,"status":"false"}).then((Logs) =>{
            resolve(Logs);
        }).catch(err => reject(err));
    })
}
const getTests = (user_id)=>{
    return new Promise ((resolve, reject) =>{
        Document.find({"user":user_id}).then((Docs) =>{
            resolve(Docs);
        }).catch(err => reject(err));
    })
}

module.exports = { requestedFile, getPatient, notifications, notify, getTests };