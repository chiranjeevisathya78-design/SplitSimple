const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const {
  getSettlements,
  getOptimizedSettlements,
  createSettlement,
  markSettlementPaid,
} = require('../controllers/settlementController');

const router = express.Router();

router.use(auth);

// Group-specific settlement routes
router.get('/groups/:id/settlements', getSettlements);
router.get('/groups/:id/settlements/optimize', getOptimizedSettlements);

// General settlement routes
router.post(
  '/',
  [
    body('groupId').isMongoId().withMessage('Valid group ID is required'),
    body('from').isMongoId().withMessage('Valid from user ID is required'),
    body('to').isMongoId().withMessage('Valid to user ID is required'),
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be greater than 0'),
  ],
  validate,
  createSettlement
);

router.patch('/:id/pay', markSettlementPaid);

module.exports = router;

