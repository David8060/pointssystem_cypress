const nodemailer = require('nodemailer');

// Create a reusable transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // Using Gmail's SMTP service
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Function to send email notification
const sendEmail = async (status) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email
    to: process.env.EMAIL_RECIPIENT, // Recipient email
    subject: status === 'success' ? '✅ Cypress Tests Passed' : '❌ Cypress Tests Failed',
    text: status === 'success' 
      ? 'The Cypress tests have completed successfully.' 
      : 'The Cypress tests have failed. Please check the logs.',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Check for status argument and send email
if (process.argv[2]) {
  sendEmail(process.argv[2]);
} else {
  console.error('Please pass a status argument (success/failure)');
}
