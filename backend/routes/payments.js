const express = require('express');
const { upload } = require('../config/cloudinary');
const path = require('path');
const Payment = require('../models/Payment');
const Project = require('../models/Project');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const { sendPaymentSubmittedEmail, sendPaymentApprovedEmail, sendPaymentRejectedEmail } = require('../utils/emailService');

const router = express.Router();

router.post('/manual-confirm', auth, upload.single('screenshot'), async (req, res) => {
  try {
    const { projectId, transactionId, paymentMethod } = req.body;
    const project = await Project.findById(projectId);
    const user = await User.findById(req.user.id);
    
    const payment = new Payment({
      userId: req.user.id,
      projectId,
      amount: project.price,
      stripePaymentId: transactionId,
      paymentMethod: paymentMethod,
      screenshot: req.file ? req.file.path : null,
      status: 'pending'
    });
    await payment.save();
    
    // Send email to admin
    await sendPaymentSubmittedEmail(
      process.env.ADMIN_EMAIL,
      { name: user.name, email: user.email, phone: user.phone },
      { title: project.title, price: project.price, transactionId }
    );
    
    res.json({ message: 'Payment submitted for verification', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/approve/:id', auth, adminAuth, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    ).populate('userId').populate('projectId');
    
    // Send approval email to user
    await sendPaymentApprovedEmail(
      payment.userId.email,
      payment.userId.name,
      payment.projectId.title
    );
    
    res.json({ message: 'Payment approved', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/reject/:id', auth, adminAuth, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).populate('userId').populate('projectId');
    
    // Send rejection email to user
    await sendPaymentRejectedEmail(
      payment.userId.email,
      payment.userId.name,
      payment.projectId.title
    );
    
    res.json({ message: 'Payment rejected', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/admin/all', auth, adminAuth, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email phone')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user/all', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate('projectId')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id, status: 'completed' })
      .populate('projectId')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
