
const sgMail = require('@sendgrid/mail');//Email gateway
//Twilio init
const accountSid = process.env.TW_SID;
const authToken = process.env.TW_AT;
const client = require('twilio')(accountSid, authToken);

//Sendfrid init
sgMail.setApiKey(process.env.SEND_GRID_API);

const registration = (user) => {
    const msg = {
        to: user.email,
        from: 'adityavadityav@gmail.com',
        subject: 'Welcome to E H R,your registration is succesfull.Id:'+user._id,
        text: 'Please login to continue',
        html: '<strong>Health record based on blockchain</strong>',
    };
    return new Promise((resolve, reject) => {
        sgMail.send(msg)
            .then(() => {
                client.messages
                    .create({
                        body: 'Your E H R registration is succesfull'+user._id,
                        from: '+15109240840',
                        to: '+91' + user.phone
                    }).catch((err) => reject(err));
            })
            .then((sucess) => resolve("Gateway succesfull |"))
            .catch((err) => reject(err));
    });
}

const requestFile = (data) => {
    return new Promise((resolve, reject) => {
        client.messages
            .create({
                body: `${data[0].doctor.fname} is requesting your health record.Please check mail to get more details. Click here ${data[0].url} `,
                from: '+15109240840',
                to: '+91' + data[0].patient.phone
            }).then(resolve("Sms request done"))
            .catch((err) => reject(err));
    })
}
module.exports = { registration, requestFile }