// utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use Mailtrap SMTP
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `EventEase <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  });

  console.log('📧 Email sent to', to);
};

export default sendEmail;
