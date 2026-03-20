const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MEDHIVE_EMAIL,
    pass: process.env.MEDHIVE_EMAIL_PASSWORD,
  },
});

module.exports = transporter;