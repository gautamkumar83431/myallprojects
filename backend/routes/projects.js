const express = require('express');
const { upload } = require('../config/cloudinary');
const path = require('path');
const Project = require('../models/Project');
const Payment = require('../models/Payment');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Test route for debugging
router.post('/test', (req, res) => {
  res.json({ message: 'Test route working', body: req.body });
});

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Headers:', req.headers);
    
    const { title, description, liveLink, price } = req.body;
    
    // Validate required fields
    if (!title || !description || !liveLink || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Create project with or without files
    const projectData = {
      title,
      description,
      liveLink,
      price: Number(price),
      image: req.files?.image?.[0]?.path || 'https://via.placeholder.com/300x200',
      zipFile: req.files?.zipFile?.[0]?.path || 'https://via.placeholder.com/file.zip'
    };
    
    const project = new Project(projectData);
    const savedProject = await project.save();
    console.log('Project saved:', savedProject);
    res.json(savedProject);
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ message: error.message, stack: error.stack });
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
