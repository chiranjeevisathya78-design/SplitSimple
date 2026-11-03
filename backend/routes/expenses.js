const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');

const router = express.Router();

router.use(auth);

router.post(
  '/',
  [
    body('groupId').isMongoId().withMessage('Valid group ID is required'),
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title is required (1-200 characters)'),
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be greater than 0'),
    body('splitType')
      .isIn(['equal', 'custom'])
      .withMessage('Split type must be equal or custom'),
    body('participants')
      .isArray({ min: 1 })
      .withMessage('At least one participant is required'),
  ],
  validate,
  createExpense
);

router.get('/', getExpenses);
router.get('/:id', getExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;

