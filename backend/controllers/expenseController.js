const Expense = require('../models/Expense');
const Group = require('../models/Group');
const AppError = require('../utils/AppError');

// Helper: check if user is a member of the group
async function ensureGroupMember(groupId, userId) {
  const group = await Group.findById(groupId);
  if (!group) {
    throw new AppError('Group not found', 404);
  }
  const isMember = group.members.some(
    (m) => m.toString() === userId.toString()
  );
  if (!isMember) {
    throw new AppError('Not authorized to access this group', 403);
  }
  return group;
}

// POST /api/expenses
exports.createExpense = async (req, res, next) => {
  try {
    const {
      groupId,
      title,
      amount,
      paidBy,
      participants,
      splitType,
      category,
      description,
      date,
    } = req.body;

    await ensureGroupMember(groupId, req.user._id);

    // Amount in paise (integer)
    const amountPaise = Math.round(amount * 100);
    if (amountPaise < 1) {
      throw new AppError('Amount must be positive', 400);
    }

    let processedParticipants;

    if (splitType === 'equal') {
      // Equal split
      const perPerson = Math.floor(amountPaise / participants.length);
      const remainder = amountPaise - perPerson * participants.length;

      processedParticipants = participants.map((p, i) => ({
        user: p.user || p,
        share: perPerson + (i < remainder ? 1 : 0), // distribute remainder
      }));
    } else if (splitType === 'custom') {
      // Custom split - convert to paise and validate sum
      processedParticipants = participants.map((p) => ({
        user: p.user,
        share: Math.round(p.share * 100),
      }));

      const totalShares = processedParticipants.reduce(
        (sum, p) => sum + p.share,
        0
      );
      if (totalShares !== amountPaise) {
        throw new AppError(
          `Custom shares (₹${(totalShares / 100).toFixed(2)}) must equal total amount (₹${(amountPaise / 100).toFixed(2)})`,
          400
        );
      }
    } else {
      throw new AppError('Invalid split type', 400);
    }

    const expense = await Expense.create({
      groupId,
      title,
      amount: amountPaise,
      paidBy: paidBy || req.user._id,
      participants: processedParticipants,
      splitType,
      category: category || 'other',
      description: description || '',
      date: date || new Date(),
    });

    const populated = await Expense.findById(expense._id)
      .populate('paidBy', 'name email')
      .populate('participants.user', 'name email')
      .populate('groupId', 'name');

    res.status(201).json({
      success: true,
      data: { expense: populated },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/expenses?groupId=...&category=...&search=...
exports.getExpenses = async (req, res, next) => {
  try {
    const { groupId, category, search, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (groupId) {
      await ensureGroupMember(groupId, req.user._id);
      filter.groupId = groupId;
    } else {
      // Get all groups user is member of
      const groups = await Group.find({ members: req.user._id }).select('_id');
      filter.groupId = { $in: groups.map((g) => g._id) };
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Expense.countDocuments(filter);

    const expenses = await Expense.find(filter)
      .populate('paidBy', 'name email')
      .populate('participants.user', 'name email')
      .populate('groupId', 'name')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        expenses,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/expenses/:id
exports.getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('paidBy', 'name email')
      .populate('participants.user', 'name email')
      .populate('groupId', 'name');

    if (!expense) {
      throw new AppError('Expense not found', 404);
    }

    await ensureGroupMember(expense.groupId._id || expense.groupId, req.user._id);

    res.json({
      success: true,
      data: { expense },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/expenses/:id
exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      throw new AppError('Expense not found', 404);
    }

    await ensureGroupMember(expense.groupId, req.user._id);

    const { title, amount, paidBy, participants, splitType, category, description, date } =
      req.body;

    if (title) expense.title = title;
    if (category) expense.category = category;
    if (description !== undefined) expense.description = description;
    if (date) expense.date = date;
    if (paidBy) expense.paidBy = paidBy;

    if (amount !== undefined && participants) {
      const amountPaise = Math.round(amount * 100);
      expense.amount = amountPaise;
      expense.splitType = splitType || expense.splitType;

      if (expense.splitType === 'equal') {
        const perPerson = Math.floor(amountPaise / participants.length);
        const remainder = amountPaise - perPerson * participants.length;
        expense.participants = participants.map((p, i) => ({
          user: p.user || p,
          share: perPerson + (i < remainder ? 1 : 0),
        }));
      } else {
        expense.participants = participants.map((p) => ({
          user: p.user,
          share: Math.round(p.share * 100),
        }));
        const totalShares = expense.participants.reduce(
          (sum, p) => sum + p.share,
          0
        );
        if (totalShares !== amountPaise) {
          throw new AppError(
            `Custom shares must equal total amount`,
            400
          );
        }
      }
    }

    await expense.save();

    const populated = await Expense.findById(expense._id)
      .populate('paidBy', 'name email')
      .populate('participants.user', 'name email')
      .populate('groupId', 'name');

    res.json({
      success: true,
      data: { expense: populated },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/expenses/:id
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      throw new AppError('Expense not found', 404);
    }

    await ensureGroupMember(expense.groupId, req.user._id);

    await Expense.findByIdAndDelete(expense._id);

    res.json({
      success: true,
      message: 'Expense deleted',
    });
  } catch (error) {
    next(error);
  }
};

