const express = require('express');
const multer = require('multer');
const path = require('path');
const Project = require('../models/Project');
const Payment = require('../models/Payment');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

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
      image: req.files.image[0].filename,
      zipFile: req.files.zipFile[0].filename
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
    const filePath = path.join(__dirname, '../uploads', project.zipFile);
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
