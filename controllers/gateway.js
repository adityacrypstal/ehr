var QRCode = require('qrcode')

const sgMail = require('@sendgrid/mail');//Email gateway
//Twilio init
const accountSid = process.env.TW_SID;
const authToken = process.env.TW_AT;
const client = require('twilio')(accountSid, authToken);

//Sendfrid init
sgMail.setApiKey(process.env.SEND_GRID_API);
//SMS for registration
const registration = (user) => {

    return new Promise((resolve, reject) => {
        const url = QRCode.toDataURL(user._id.toString(), function (err, url) {
            let imageData = url;
            let imageb64 = imageData.replace('data:image/png;base64,', '');
            const msg = {
                to: user.email,
                from: 'adityavadityav@gmail.com',
                subject: 'Welcome to E H R,your registration is succesfull.Here is you EHR UID:' + user._id,
                text: 'Please login to continue',
                html: '<img src="cid:myimagecid"/>',
                attachments: [
                    {
                        filename: "imageattachment.png",
                        content: imageb64,
                        content_id: "myimagecid",
                    }
                ]
            };
            sgMail.send(msg)
                .then(() => {
                    client.messages
                        .create({
                            body: 'Your E H R registration is succesfull' + user._id,
                            from: '+15109240840',
                            to: '+91' + user.phone
                        }).catch((err) => reject(err));
                })
                .then((sucess) => resolve("Gateway succesfull |"))
                .catch((err) => reject(err));
        });
    });

}
//Doctor requesting file from patient SMS
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
const sendTxn = (Id, patient, callback )=>{
    const msg = {
        to: patient.email,
        from: 'adityavadityav@gmail.com',
        subject: 'New Transaction recorded in you EHR',
        text: 'New Txn recorded with TXN ID '+Id,
    };
    client.messages.create({
        body: `New transaction recorded in EHR (${Id}).`,
        from:   '+15109240840',
        to : '+91' + patient.phone
    })
    sgMail.send(msg).then((res)=>{
        callback(null, 'Mail send');
    }).catch((err)=>{
        callback(err, null);
    })
}
module.exports = { registration, requestFile, sendTxn }