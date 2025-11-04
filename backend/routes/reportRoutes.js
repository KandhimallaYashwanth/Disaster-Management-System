const express = require('express');
const Report = require('../models/Report');
const router = express.Router();

// POST /api/reports - Create a new report
router.post('/', async (req, res) => {
  try {
    const {
      type,
      severity,
      title,
      description,
      address,
      city,
      state,
      pincode,
      location,
      contactName,
      contactPhone,
      contactEmail,
      anonymous
    } = req.body;

    if (!type || !severity || !title || !description || !address || !city || !state || !contactPhone) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const report = await Report.create({
      type,
      severity,
      title,
      description,
      address,
      city,
      state,
      pincode,
      location,
      contactName,
      contactPhone,
      contactEmail,
      anonymous: Boolean(anonymous),
    });

    return res.status(201).json({ success: true, report });
  } catch (err) {
    console.error('Create report error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error creating report' });
  }
});

// GET /api/reports - List reports (newest first)
router.get('/', async (_req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 }).limit(100);
    return res.json({ success: true, reports });
  } catch (err) {
    console.error('List reports error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error fetching reports' });
  }
});

module.exports = router;


