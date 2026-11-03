const Group = require('../models/Group');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');
const {
  calculateBalances,
} = require('../services/settlementEngine');

// GET /api/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all groups the user is a member of
    const groups = await Group.find({ members: userId })
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    const groupIds = groups.map((g) => g._id);

    // Get all expenses across user's groups
    const expenses = await Expense.find({ groupId: { $in: groupIds } })
      .populate('paidBy', 'name email')
      .populate('participants.user', 'name email')
      .populate('groupId', 'name')
      .sort({ date: -1 });

    const paidSettlements = await Settlement.find({
      groupId: { $in: groupIds },
      status: 'paid',
    });

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Calculate how much the user owes and is owed across all groups
    let youOwe = 0;
    let youAreOwed = 0;

    for (const groupId of groupIds) {
      const groupExpenses = expenses.filter(
        (e) => (e.groupId._id || e.groupId).toString() === groupId.toString()
      );
      const groupSettlements = paidSettlements.filter(
        (s) => s.groupId.toString() === groupId.toString()
      );

      const balances = calculateBalances(groupExpenses, groupSettlements);
      const userBalance = balances.get(userId.toString()) || 0;

      if (userBalance > 0) {
        youAreOwed += userBalance;
      } else if (userBalance < 0) {
        youOwe += Math.abs(userBalance);
      }
    }

    // Recent expenses (last 5)
    const recentExpenses = expenses.slice(0, 5);

    // Category breakdown
    const categoryBreakdown = {};
    for (const expense of expenses) {
      const cat = expense.category || 'other';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + expense.amount;
    }

    // Monthly spending (last 6 months)
    const monthlySpending = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlySpending[key] = 0;
    }
    for (const expense of expenses) {
      const d = new Date(expense.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthlySpending[key] !== undefined) {
        monthlySpending[key] += expense.amount;
      }
    }

    res.json({
      success: true,
      data: {
        summary: {
          totalExpenses,
          totalExpensesFormatted: (totalExpenses / 100).toFixed(2),
          youOwe,
          youOweFormatted: (youOwe / 100).toFixed(2),
          youAreOwed,
          youAreOwedFormatted: (youAreOwed / 100).toFixed(2),
          activeGroups: groups.length,
        },
        recentExpenses,
        groups: groups.map((g) => ({
          _id: g._id,
          name: g.name,
          memberCount: g.members.length,
          members: g.members,
        })),
        analytics: {
          categoryBreakdown,
          monthlySpending,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

