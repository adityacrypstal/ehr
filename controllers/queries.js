const express = require('express');
const Blockchain = require('../models/Blockchain');
const User = require('../models/User');
const Logs = require('../models/Logs');

const requestedFile = (userId, callback) => {
    Logs.findOne({ "doctor_id": userId, "status": true })
        .then(res => {
            let patient_id = res.patient_id;
            Blockchain.findOne({ "userid": patient_id })
                .then(file => {
                    callback(null, file.hash);
                });

        })
        .catch(err => callback(null, null));
}

module.exports = { requestedFile };