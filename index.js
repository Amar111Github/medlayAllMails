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

app.post('/api/career', upload.single("resume"), (req, res) => {
  const { firstname, lastname, email, mobile, gender, position } = req.body;
  const resume = req.file;
  const mail = {
    to: process.env.EMAIL_USER,
    from: req.body.email,
    
    subject: 'Madley international Website Career Form Submission',
    html: `
      <p>Firstname: ${firstname}</p>
      <p>Lastname: ${lastname}</p>
      <p>Email: ${email}</p>
      <p>Mobile: ${mobile}</p>
      <p>Gender: ${gender}</p>
      <p>Position: ${position}</p>`,
      attachments: [
        {
          filename: "resume.pdf", // Change the filename as needed
          content: resume.buffer,
        },
        // {
        //   filename: "resume.txt", // Change the filename as needed
        //   content: resume.buffer,
        // },
        // {
        //   filename: "resume.jpg", // Change the filename as needed
        //   content: resume.buffer,
        // },
        // {
        //   filename: "resume.png", // Change the filename as needed
        //   content: resume.buffer,
        // },
        // {
        //   filename: "resume.doc", // Change the filename as needed
        //   content: resume.buffer,
        // },
      ],
  };
  transporter.sendMail(mail, (error) => {
    if (error) {
      console.error(error);
      res.status(500).json({ status: 'ERROR' });
    } else {
      res.json({ status: 'Message Sent' });
    }
  });
});

app.post('/api/contact', (req, res) => {
  const { firstname, lastname,email, mobile, requirement, message } = req.body;

  const mail = {
    from: req.body.email,
    to: process.env.EMAIL_USER,  
    subject: 'Madley international Website Contact Form Submission',
    html: `
    <p>Firstname: ${firstname}</p>
    <p>Lastname: ${lastname}</p>
      <p>Email: ${email}</p>
      <p>Mobile: ${mobile}</p>
      <p>Requirement: ${requirement}</p>
      <p>Message: ${message}</p>`,
  };

  transporter.sendMail(mail, (error) => {
    if (error) {
      console.error(error);
      res.status(500).json({ status: 'ERROR' });
    } else {
      res.json({ status: 'Message Sent' });
    }
  });
});

app.post('/api/unsubscribe', (req, res) => {
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