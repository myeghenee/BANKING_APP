const nodemailer = require('nodemailer');

const transporter = require('nodemailer').createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async (to, subject, html) => {
    await transporter.sendMail({
        from: "Banking App" + "<" + process.env.EMAIL_USERNAME + ">",
        to,
        subject,
        html,
    });
};

module.exports = { sendEmail };