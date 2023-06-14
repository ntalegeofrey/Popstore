const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const sendMail = (recipient, subject, body) => {
  // Create a transport instance using Gmail SMTP settings
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ntalegeofrey@gmail.com", // Your Gmail account
      pass: "Wandindabye@393", // Your Gmail account password
    },
  });

  // Set email details
  const mailOptions = {
    from: "ntalegeofrey@gmail.com", // Your Gmail account
    to: recipient,
    subject: subject,
    text: body,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export default sendMail;
