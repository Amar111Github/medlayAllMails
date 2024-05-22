// server.js

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Ready to Send');
  }
});


app.post('/api/contact', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ status: 'ERROR', message: 'Email address is required.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, // Recommended: Use your own email verified with the email service
    to: process.env.EMAIL_USER,  
    subject: 'MEDLAY INTERNATIONAL UNSUBSCRIBED MALI ',
    html: `<p>Email: ${email}</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Failed to send email:', error);
      return res.status(500).json({ status: 'ERROR', message: 'Failed to send email.' });
    }
    res.json({ status: 'SUCCESS', message: 'Unsubscribed Successfully.', info: info.response });
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
