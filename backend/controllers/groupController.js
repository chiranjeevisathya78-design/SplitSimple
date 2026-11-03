const Group = require('../models/Group');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');
const User = require('../models/User');
const AppError = require('../utils/AppError');

// POST /api/groups
exports.createGroup = async (req, res, next) => {
  try {
    const { name, description, memberEmails } = req.body;
    const members = [req.user._id]; // Creator is always a member

    // Look up member emails and add their IDs
    if (memberEmails && memberEmails.length > 0) {
      for (const email of memberEmails) {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user && !members.some((m) => m.toString() === user._id.toString())) {
          members.push(user._id);
        }
      }
    }

    const group = await Group.create({
      name,
      description: description || '',
      createdBy: req.user._id,
      members,
    });

    const populated = await Group.findById(group._id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: { group: populated },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/groups
exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('members', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { groups },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/groups/:id
exports.getGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    if (!group) {
      throw new AppError('Group not found', 404);
    }

    // Check membership
    const isMember = group.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      throw new AppError('Not authorized to access this group', 403);
    }

    res.json({
      success: true,
      data: { group },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/groups/:id
exports.updateGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      throw new AppError('Group not found', 404);
    }

    // Only creator can update
    if (group.createdBy.toString() !== req.user._id.toString()) {
      throw new AppError('Only the group creator can update this group', 403);
    }

    const { name, description, memberEmails } = req.body;

    if (name) group.name = name;
    if (description !== undefined) group.description = description;

    if (memberEmails) {
      const members = [req.user._id];
      for (const email of memberEmails) {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user && !members.some((m) => m.toString() === user._id.toString())) {
          members.push(user._id);
        }
      }
      group.members = members;
    }

    await group.save();

    const populated = await Group.findById(group._id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      data: { group: populated },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/groups/:id
exports.deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      throw new AppError('Group not found', 404);
    }

    if (group.createdBy.toString() !== req.user._id.toString()) {
      throw new AppError('Only the group creator can delete this group', 403);
    }

    // Delete all related expenses and settlements
    await Expense.deleteMany({ groupId: group._id });
    await Settlement.deleteMany({ groupId: group._id });
    await Group.findByIdAndDelete(group._id);

    res.json({
      success: true,
      message: 'Group and all related data deleted',
    });
  } catch (error) {
    next(error);
  }
};

