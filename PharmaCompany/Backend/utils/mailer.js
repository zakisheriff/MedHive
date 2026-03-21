import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // This automatically sets host to smtp.gmail.com and port to 465/587
  auth: {
    user: process.env.MEDHIVE_EMAIL,
    pass: process.env.MEDHIVE_EMAIL_PASS,
  },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Mailer Error:", error);
  } else {
    console.log("📧 Mailer is ready to send emails");
  }
});

export default transporter;