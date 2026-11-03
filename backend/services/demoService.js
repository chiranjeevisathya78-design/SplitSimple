const User = require('../models/User');
const Group = require('../models/Group');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');

/**
 * Seed or reset the comprehensive SplitSimple demo environment.
 * Generates 5 sample users, 3 groups, ~22 realistic expenses, and completed settlements.
 */
async function seedDemoData() {
  console.log('[Demo] Seeding SplitSimple demo universe...');

  const demoEmails = [
    'chiranjeevi@example.com',
    'gagan@example.com',
    'pranav@example.com',
    'chandan@example.com',
    'rahul@example.com',
  ];

  // 1. Upsert or find demo users
  const users = {};

  const userConfigs = [
    { name: 'CHIRANJEEVI S', email: 'chiranjeevi@example.com' },
    { name: 'Gagan K', email: 'gagan@example.com' },
    { name: 'Pranav M', email: 'pranav@example.com' },
    { name: 'Chandan R', email: 'chandan@example.com' },
    { name: 'Rahul V', email: 'rahul@example.com' },
  ];

  for (const cfg of userConfigs) {
    let u = await User.findOne({ email: cfg.email });
    if (!u) {
      u = await User.create({
        name: cfg.name,
        email: cfg.email,
        password: 'password123',
      });
    }
    users[cfg.email] = u;
  }

  const userIds = Object.values(users).map((u) => u._id);

  // Remove existing demo groups, expenses, and settlements
  const existingDemoGroups = await Group.find({
    name: { $in: ['Bangalore Roommates', 'Goa Trip', 'College Friends'] },
  });
  const groupIds = existingDemoGroups.map((g) => g._id);

  await Expense.deleteMany({ groupId: { $in: groupIds } });
  await Settlement.deleteMany({ groupId: { $in: groupIds } });
  await Group.deleteMany({ _id: { $in: groupIds } });

  // 2. Create Group A: Bangalore Roommates (4 members)
  const groupA = await Group.create({
    name: 'Bangalore Roommates',
    description: 'Flat 402, Indiranagar — Shared monthly rent, utilities, and domestic essentials',
    createdBy: users['chiranjeevi@example.com']._id,
    members: [
      users['chiranjeevi@example.com']._id,
      users['gagan@example.com']._id,
      users['pranav@example.com']._id,
      users['chandan@example.com']._id,
    ],
  });

  // 3. Create Group B: Goa Trip (5 members)
  const groupB = await Group.create({
    name: 'Goa Trip',
    description: 'Annual getaway: North Goa beach resort, bike rentals, and sunset cruise',
    createdBy: users['gagan@example.com']._id,
    members: [
      users['chiranjeevi@example.com']._id,
      users['gagan@example.com']._id,
      users['pranav@example.com']._id,
      users['chandan@example.com']._id,
      users['rahul@example.com']._id,
    ],
  });

  // 4. Create Group C: College Friends (4 members)
  const groupC = await Group.create({
    name: 'College Friends',
    description: 'Weekend football, movies, cafe catchups, and reunion dinners',
    createdBy: users['pranav@example.com']._id,
    members: [
      users['chiranjeevi@example.com']._id,
      users['pranav@example.com']._id,
      users['chandan@example.com']._id,
      users['rahul@example.com']._id,
    ],
  });

  const now = new Date();
  const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // 5. Seed Expenses for Group A (Bangalore Roommates)
  const expensesA = [
    {
      groupId: groupA._id,
      title: 'Monthly House Rent (Advance)',
      amount: 4000000, // ₹40,000
      paidBy: users['chiranjeevi@example.com']._id,
      splitType: 'equal',
      category: 'rent',
      description: 'Monthly flat rent transferred to owner',
      date: daysAgo(28),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 1000000 },
        { user: users['gagan@example.com']._id, share: 1000000 },
        { user: users['pranav@example.com']._id, share: 1000000 },
        { user: users['chandan@example.com']._id, share: 1000000 },
      ],
    },
    {
      groupId: groupA._id,
      title: 'Nature Basket Monthly Groceries',
      amount: 480000, // ₹4,800
      paidBy: users['gagan@example.com']._id,
      splitType: 'equal',
      category: 'groceries',
      description: 'Cooking oil, spices, pulses, rice, snacks',
      date: daysAgo(24),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 120000 },
        { user: users['gagan@example.com']._id, share: 120000 },
        { user: users['pranav@example.com']._id, share: 120000 },
        { user: users['chandan@example.com']._id, share: 120000 },
      ],
    },
    {
      groupId: groupA._id,
      title: 'BESCOM Electricity Bill',
      amount: 220000, // ₹2,200
      paidBy: users['pranav@example.com']._id,
      splitType: 'equal',
      category: 'utilities',
      description: 'Air conditioning & summer electricity usage',
      date: daysAgo(18),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 55000 },
        { user: users['gagan@example.com']._id, share: 55000 },
        { user: users['pranav@example.com']._id, share: 55000 },
        { user: users['chandan@example.com']._id, share: 55000 },
      ],
    },
    {
      groupId: groupA._id,
      title: 'Airtel Xstream 300Mbps Fiber',
      amount: 141500, // ₹1,415
      paidBy: users['chandan@example.com']._id,
      splitType: 'equal',
      category: 'utilities',
      description: 'High-speed broadband + OTT plan',
      date: daysAgo(15),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 35375 },
        { user: users['gagan@example.com']._id, share: 35375 },
        { user: users['pranav@example.com']._id, share: 35375 },
        { user: users['chandan@example.com']._id, share: 35375 },
      ],
    },
    {
      groupId: groupA._id,
      title: 'Deep House Cleaning & Urban Company',
      amount: 240000, // ₹2,400
      paidBy: users['chiranjeevi@example.com']._id,
      splitType: 'custom',
      category: 'utilities',
      description: 'Deep kitchen & balcony cleaning. Master bedroom pays extra.',
      date: daysAgo(10),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 80000 },
        { user: users['gagan@example.com']._id, share: 60000 },
        { user: users['pranav@example.com']._id, share: 50000 },
        { user: users['chandan@example.com']._id, share: 50000 },
      ],
    },
    {
      groupId: groupA._id,
      title: 'Bisleri Drinking Water Cans (20x)',
      amount: 160000, // ₹1,600
      paidBy: users['gagan@example.com']._id,
      splitType: 'equal',
      category: 'groceries',
      description: 'Monthly mineral water delivery coupon book',
      date: daysAgo(5),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 40000 },
        { user: users['gagan@example.com']._id, share: 40000 },
        { user: users['pranav@example.com']._id, share: 40000 },
        { user: users['chandan@example.com']._id, share: 40000 },
      ],
    },
    {
      groupId: groupA._id,
      title: 'Sunday Rooftop BBQ Grill',
      amount: 320000, // ₹3,200
      paidBy: users['pranav@example.com']._id,
      splitType: 'equal',
      category: 'food',
      description: 'Charcoal, marinated skewers, beverages',
      date: daysAgo(2),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 80000 },
        { user: users['gagan@example.com']._id, share: 80000 },
        { user: users['pranav@example.com']._id, share: 80000 },
        { user: users['chandan@example.com']._id, share: 80000 },
      ],
    },
  ];

  // 6. Seed Expenses for Group B (Goa Trip)
  const expensesB = [
    {
      groupId: groupB._id,
      title: 'Anjuna Beachfront Villa Booking',
      amount: 4500000, // ₹45,000
      paidBy: users['gagan@example.com']._id,
      splitType: 'equal',
      category: 'travel',
      description: '3 nights stay with private pool and breakfast',
      date: daysAgo(20),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 900000 },
        { user: users['gagan@example.com']._id, share: 900000 },
        { user: users['pranav@example.com']._id, share: 900000 },
        { user: users['chandan@example.com']._id, share: 900000 },
        { user: users['rahul@example.com']._id, share: 900000 },
      ],
    },
    {
      groupId: groupB._id,
      title: 'Activa 6G Scooter Rentals (3 Days)',
      amount: 750000, // ₹7,500
      paidBy: users['chandan@example.com']._id,
      splitType: 'equal',
      category: 'transport',
      description: '5 scooters with helmets and full tanks',
      date: daysAgo(19),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 150000 },
        { user: users['gagan@example.com']._id, share: 150000 },
        { user: users['pranav@example.com']._id, share: 150000 },
        { user: users['chandan@example.com']._id, share: 150000 },
        { user: users['rahul@example.com']._id, share: 150000 },
      ],
    },
    {
      groupId: groupB._id,
      title: 'Fisherman’s Wharf Candlelight Dinner',
      amount: 980000, // ₹9,800
      paidBy: users['chiranjeevi@example.com']._id,
      splitType: 'custom',
      category: 'food',
      description: 'Goan fish curry, tiger prawns, and dessert platter',
      date: daysAgo(18),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 220000 },
        { user: users['gagan@example.com']._id, share: 200000 },
        { user: users['pranav@example.com']._id, share: 200000 },
        { user: users['chandan@example.com']._id, share: 180000 },
        { user: users['rahul@example.com']._id, share: 180000 },
      ],
    },
    {
      groupId: groupB._id,
      title: 'Grande Island Scuba Diving & Dolphin Trip',
      amount: 1500000, // ₹15,000
      paidBy: users['rahul@example.com']._id,
      splitType: 'equal',
      category: 'entertainment',
      description: 'PADI guided shallow dive with underwater video',
      date: daysAgo(17),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 300000 },
        { user: users['gagan@example.com']._id, share: 300000 },
        { user: users['pranav@example.com']._id, share: 300000 },
        { user: users['chandan@example.com']._id, share: 300000 },
        { user: users['rahul@example.com']._id, share: 300000 },
      ],
    },
    {
      groupId: groupB._id,
      title: 'Curlies Shack Sunset Drinks & Tapas',
      amount: 540000, // ₹5,400
      paidBy: users['pranav@example.com']._id,
      splitType: 'equal',
      category: 'food',
      description: 'Anjuna beach shack party snacks and shakes',
      date: daysAgo(16),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 108000 },
        { user: users['gagan@example.com']._id, share: 108000 },
        { user: users['pranav@example.com']._id, share: 108000 },
        { user: users['chandan@example.com']._id, share: 108000 },
        { user: users['rahul@example.com']._id, share: 108000 },
      ],
    },
    {
      groupId: groupB._id,
      title: 'Mandovi River Luxury Sunset Cruise',
      amount: 600000, // ₹6,000
      paidBy: users['gagan@example.com']._id,
      splitType: 'equal',
      category: 'entertainment',
      description: '2-hour evening cruise with folk dance performance',
      date: daysAgo(15),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 120000 },
        { user: users['gagan@example.com']._id, share: 120000 },
        { user: users['pranav@example.com']._id, share: 120000 },
        { user: users['chandan@example.com']._id, share: 120000 },
        { user: users['rahul@example.com']._id, share: 120000 },
      ],
    },
  ];

  // 7. Seed Expenses for Group C (College Friends)
  const expensesC = [
    {
      groupId: groupC._id,
      title: 'Dune Part Two — PVR IMAX 3D',
      amount: 280000, // ₹2,800
      paidBy: users['pranav@example.com']._id,
      splitType: 'equal',
      category: 'entertainment',
      description: 'Center recliner seats + caramel popcorn tub',
      date: daysAgo(12),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 70000 },
        { user: users['pranav@example.com']._id, share: 70000 },
        { user: users['chandan@example.com']._id, share: 70000 },
        { user: users['rahul@example.com']._id, share: 70000 },
      ],
    },
    {
      groupId: groupC._id,
      title: 'Truffles Koramangala Burgers & Steaks',
      amount: 360000, // ₹3,600
      paidBy: users['chandan@example.com']._id,
      splitType: 'equal',
      category: 'food',
      description: 'All-American cheese burgers and Dutch truffle cake',
      date: daysAgo(8),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 90000 },
        { user: users['pranav@example.com']._id, share: 90000 },
        { user: users['chandan@example.com']._id, share: 90000 },
        { user: users['rahul@example.com']._id, share: 90000 },
      ],
    },
    {
      groupId: groupC._id,
      title: 'Play Arena Night Football Turf (2h)',
      amount: 240000, // ₹2,400
      paidBy: users['rahul@example.com']._id,
      splitType: 'equal',
      category: 'entertainment',
      description: 'Floodlight 5-a-side football court booking',
      date: daysAgo(4),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 60000 },
        { user: users['pranav@example.com']._id, share: 60000 },
        { user: users['chandan@example.com']._id, share: 60000 },
        { user: users['rahul@example.com']._id, share: 60000 },
      ],
    },
    {
      groupId: groupC._id,
      title: 'Third Wave Specialty Coffee & Cheesecakes',
      amount: 180000, // ₹1,800
      paidBy: users['chiranjeevi@example.com']._id,
      splitType: 'custom',
      category: 'food',
      description: 'Post-game iced lattes and bagels',
      date: daysAgo(1),
      participants: [
        { user: users['chiranjeevi@example.com']._id, share: 55000 },
        { user: users['pranav@example.com']._id, share: 45000 },
        { user: users['chandan@example.com']._id, share: 40000 },
        { user: users['rahul@example.com']._id, share: 40000 },
      ],
    },
  ];

  await Expense.insertMany([...expensesA, ...expensesB, ...expensesC]);
  console.log(`[Demo] Inserted ${expensesA.length + expensesB.length + expensesC.length} realistic expenses across 3 groups.`);

  // 8. Completed Sample Settlements (for realism & history)
  // Gagan paid Chiranjeevi ₹10,000 for Bangalore Roommates rent share
  const settlement1 = await Settlement.create({
    groupId: groupA._id,
    from: users['gagan@example.com']._id,
    to: users['chiranjeevi@example.com']._id,
    amount: 1000000, // ₹10,000
    status: 'paid',
    settledAt: daysAgo(21),
  });

  // Pranav paid Chiranjeevi ₹5,000 partial rent
  const settlement2 = await Settlement.create({
    groupId: groupA._id,
    from: users['pranav@example.com']._id,
    to: users['chiranjeevi@example.com']._id,
    amount: 500000, // ₹5,000
    status: 'paid',
    settledAt: daysAgo(12),
  });

  // Rahul paid Gagan ₹9,000 for Goa Villa share
  const settlement3 = await Settlement.create({
    groupId: groupB._id,
    from: users['rahul@example.com']._id,
    to: users['gagan@example.com']._id,
    amount: 900000, // ₹9,000
    status: 'paid',
    settledAt: daysAgo(14),
  });

  console.log('[Demo] Recorded 3 completed demo settlements.');

  return {
    users: userConfigs,
    groups: [groupA, groupB, groupC],
    expenseCount: expensesA.length + expensesB.length + expensesC.length,
    settlementCount: 3,
  };
}

module.exports = { seedDemoData };
