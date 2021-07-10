const nodemailer = require("nodemailer");

module.exports = {
    transporter: nodemailer.createTransport({
        host: "rsglobal.com.ng",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.user,
            pass: process.env.password,
        },
    }),
} 