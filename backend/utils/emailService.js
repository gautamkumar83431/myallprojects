const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendPaymentSubmittedEmail = async (adminEmail, userDetails, projectDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: '🔔 New Payment - Verification Required',
    html: `
      <h1>💳 New Payment Received</h1>
      <p><strong>User:</strong> ${userDetails.name} (${userDetails.email})</p>
      <p><strong>Phone:</strong> ${userDetails.phone}</p>
      <p><strong>Project:</strong> ${projectDetails.title}</p>
      <p><strong>Amount:</strong> ₹${projectDetails.price}</p>
      <p><strong>Transaction ID:</strong> ${projectDetails.transactionId}</p>
      <p>⚠️ Please verify and approve/reject from admin panel.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email error:', error);
  }
};

const sendPaymentApprovedEmail = async (userEmail, userName, projectTitle) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: '✅ Payment Approved - Download Now!',
    html: `
      <h1>✅ Payment Approved!</h1>
      <p>Hi ${userName},</p>
      <p>Your payment has been approved.</p>
      <p><strong>Project:</strong> ${projectTitle}</p>
      <p>You can now download from My Purchases section.</p>
      <a href="http://localhost:3000/my-purchases">Download Now</a>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email error:', error);
  }
};

const sendPaymentRejectedEmail = async (userEmail, userName, projectTitle) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: '❌ Payment Rejected',
    html: `
      <h1>❌ Payment Rejected</h1>
      <p>Hi ${userName},</p>
      <p>Your payment could not be verified.</p>
      <p><strong>Project:</strong> ${projectTitle}</p>
      <p>Please contact support or try again.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email error:', error);
  }
};

module.exports = {
  sendPaymentSubmittedEmail,
  sendPaymentApprovedEmail,
  sendPaymentRejectedEmail
};
