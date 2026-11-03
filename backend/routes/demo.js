const express = require('express');
const { seedDemoData } = require('../services/demoService');

const router = express.Router();

// GET /api/demo/info
router.get('/info', async (req, res) => {
  res.json({
    success: true,
    data: {
      isDemoAvailable: true,
      demoAccount: {
        email: 'chiranjeevi@example.com',
        password: 'password123',
        name: 'CHIRANJEEVI S',
      },
      sampleGroups: ['Bangalore Roommates', 'Goa Trip', 'College Friends'],
    },
  });
});

// POST /api/demo/reset
router.post('/reset', async (req, res, next) => {
  try {
    const result = await seedDemoData();
    res.json({
      success: true,
      message: 'Demo universe reset successfully to standard initial state.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
