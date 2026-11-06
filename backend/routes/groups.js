const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  joinDemo,
  addMember,
} = require('../controllers/groupController');
const {
  getBalances,
} = require('../controllers/settlementController');

const router = express.Router();

router.use(auth);

router.post(
  '/',
  [
    body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Group name is required (1-100 characters)'),
  ],
  validate,
  createGroup
);

router.get('/', getGroups);
router.get('/:id', getGroup);

router.put(
  '/:id',
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Group name must be 1-100 characters'),
  ],
  validate,
  updateGroup
);

router.post('/join-demo', joinDemo);
router.post('/:id/members', addMember);

router.delete('/:id', deleteGroup);

// Balance and settlement routes nested under groups
router.get('/:id/balances', getBalances);

module.exports = router;

