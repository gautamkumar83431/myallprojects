const express = require('express');
const { upload } = require('../config/cloudinary');
const path = require('path');
const Project = require('../models/Project');
const Payment = require('../models/Payment');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, adminAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'zipFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, liveLink, price } = req.body;
    const project = new Project({
      title,
      description,
      liveLink,
      price,
      image: req.files.image[0].path,
      zipFile: req.files.zipFile[0].path
    });
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/download/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      userId: req.user.id, 
      projectId: req.params.id,
      status: 'completed'
    });
    
    if (!payment) return res.status(403).json({ message: 'Payment not approved' });
    
    const project = await Project.findById(req.params.id);
    res.redirect(project.zipFile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
