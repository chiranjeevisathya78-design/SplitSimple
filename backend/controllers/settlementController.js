const Group = require('../models/Group');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');
const AppError = require('../utils/AppError');
const {
  calculateBalances,
  optimizeSettlements,
} = require('../services/settlementEngine');

// Helper
async function ensureGroupMember(groupId, userId) {
  const group = await Group.findById(groupId);
  if (!group) throw new AppError('Group not found', 404);
  const isMember = group.members.some(
    (m) => m.toString() === userId.toString()
  );
  if (!isMember) throw new AppError('Not authorized', 403);
  return group;
}

// GET /api/groups/:id/balances
exports.getBalances = async (req, res, next) => {
  try {
    const group = await ensureGroupMember(req.params.id, req.user._id);

    const expenses = await Expense.find({ groupId: group._id });
    const paidSettlements = await Settlement.find({
      groupId: group._id,
      status: 'paid',
    });

    const balances = calculateBalances(expenses, paidSettlements);

    // Populate user info
    const populatedBalances = [];
    for (const member of group.members) {
      const userId = member.toString();
      const balance = balances.get(userId) || 0;
      populatedBalances.push({
        userId,
        balance, // in paise
      });
    }

    // Populate with user data
    const populatedGroup = await Group.findById(group._id).populate(
      'members',
      'name email'
    );

    const result = populatedBalances.map((b) => {
      const member = populatedGroup.members.find(
        (m) => m._id.toString() === b.userId
      );
      return {
        user: member,
        balance: b.balance,
        balanceFormatted: (b.balance / 100).toFixed(2),
      };
    });

    // Calculate summary
    const totalOwed = result
      .filter((r) => r.balance > 0)
      .reduce((sum, r) => sum + r.balance, 0);
    const totalOwing = result
      .filter((r) => r.balance < 0)
      .reduce((sum, r) => sum + Math.abs(r.balance), 0);

    res.json({
      success: true,
      data: {
        groupId: group._id,
        groupName: populatedGroup.name,
        balances: result,
        summary: {
          totalOwed,
          totalOwing,
          totalOwedFormatted: (totalOwed / 100).toFixed(2),
          totalOwingFormatted: (totalOwing / 100).toFixed(2),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/groups/:id/settlements
exports.getSettlements = async (req, res, next) => {
  try {
    await ensureGroupMember(req.params.id, req.user._id);

    const settlements = await Settlement.find({ groupId: req.params.id })
      .populate('from', 'name email')
      .populate('to', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { settlements },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/groups/:id/settlements/optimize
exports.getOptimizedSettlements = async (req, res, next) => {
  try {
    const group = await ensureGroupMember(req.params.id, req.user._id);

    const expenses = await Expense.find({ groupId: group._id });
    const paidSettlements = await Settlement.find({
      groupId: group._id,
      status: 'paid',
    });

    if (expenses.length === 0) {
      return res.json({
        success: true,
        data: {
          transactions: [],
          totalOutstanding: 0,
          message: 'No expenses in this group',
        },
      });
    }

    const balances = calculateBalances(expenses, paidSettlements);

    // Check if already settled
    const hasOutstanding = Array.from(balances.values()).some(
      (b) => Math.abs(b) > 0
    );
    if (!hasOutstanding) {
      return res.json({
        success: true,
        data: {
          transactions: [],
          totalOutstanding: 0,
          message: 'All balances are settled',
        },
      });
    }

    const optimized = optimizeSettlements(balances);

    // Populate user info
    const populatedGroup = await Group.findById(group._id).populate(
      'members',
      'name email'
    );

    const memberMap = {};
    for (const m of populatedGroup.members) {
      memberMap[m._id.toString()] = m;
    }

    const transactions = optimized.map((t) => ({
      from: memberMap[t.from] || { _id: t.from, name: 'Unknown' },
      to: memberMap[t.to] || { _id: t.to, name: 'Unknown' },
      amount: t.amount,
      amountFormatted: (t.amount / 100).toFixed(2),
    }));

    const totalOutstanding = optimized.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // Build current balances for display
    const currentBalances = [];
    for (const [userId, balance] of balances) {
      currentBalances.push({
        user: memberMap[userId] || { _id: userId, name: 'Unknown' },
        balance,
        balanceFormatted: (balance / 100).toFixed(2),
      });
    }

    res.json({
      success: true,
      data: {
        transactions,
        currentBalances,
        transactionCount: transactions.length,
        totalOutstanding,
        totalOutstandingFormatted: (totalOutstanding / 100).toFixed(2),
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/settlements
exports.createSettlement = async (req, res, next) => {
  try {
    const { groupId, from, to, amount } = req.body;

    await ensureGroupMember(groupId, req.user._id);

    const amountPaise = Math.round(amount * 100);
    if (amountPaise < 1) {
      throw new AppError('Amount must be positive', 400);
    }

    // Check for duplicate pending settlement
    const existingPending = await Settlement.findOne({
      groupId,
      from,
      to,
      amount: amountPaise,
      status: 'pending',
    });
    if (existingPending) {
      throw new AppError('A pending settlement with same details already exists', 409);
    }

    const settlement = await Settlement.create({
      groupId,
      from,
      to,
      amount: amountPaise,
      status: 'pending',
    });

    const populated = await Settlement.findById(settlement._id)
      .populate('from', 'name email')
      .populate('to', 'name email');

    res.status(201).json({
      success: true,
      data: { settlement: populated },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/settlements/:id/pay
exports.markSettlementPaid = async (req, res, next) => {
  try {
    const settlement = await Settlement.findById(req.params.id);
    if (!settlement) {
      throw new AppError('Settlement not found', 404);
    }

    await ensureGroupMember(settlement.groupId, req.user._id);

    if (settlement.status === 'paid') {
      throw new AppError('Settlement is already marked as paid', 400);
    }

    settlement.status = 'paid';
    settlement.settledAt = new Date();
    await settlement.save();

    const populated = await Settlement.findById(settlement._id)
      .populate('from', 'name email')
      .populate('to', 'name email');

    res.json({
      success: true,
      data: { settlement: populated },
    });
  } catch (error) {
    next(error);
  }
};

