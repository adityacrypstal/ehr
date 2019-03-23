const express = require('express');
// const Blockchain = require('../models/Blockchain');
const BC = require('../controllers/blockchain');
const User = require('../models/User');
const Logs = require('../models/Logs');

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

module.exports = { requestedFile, getPatient };