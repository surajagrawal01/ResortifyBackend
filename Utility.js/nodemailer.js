const nodemailer = require("nodemailer")
const sendMail = (email, htmlMsg) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    async function mailSend() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USERNAME, // sender address
            to: email, // list of receivers
            subject: "Registration Confirmation", // Subject line
            html: htmlMsg, // html body
        });
    }
    mailSend().catch(console.error)
}

module.exports = sendMail ;