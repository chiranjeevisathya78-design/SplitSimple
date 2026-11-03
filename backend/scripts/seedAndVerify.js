const mongoose = require('mongoose');
const User = require('../models/User');
const Group = require('../models/Group');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');
const { calculateBalances, optimizeSettlements } = require('../services/settlementEngine');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/splitsimple';

async function run() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected successfully!');

  // Clear existing test data
  await User.deleteMany({});
  await Group.deleteMany({});
  await Expense.deleteMany({});
  await Settlement.deleteMany({});
  console.log('Cleared database.');

  // 1. Create demo users
  console.log('\n--- 1. Creating Users ---');
  const user1 = await User.create({
    name: 'CHIRANJEEVI S',
    email: 'chiranjeevi@example.com',
    password: 'password123',
  });
  const user2 = await User.create({
    name: 'Gagan K',
    email: 'gagan@example.com',
    password: 'password123',
  });
  const user3 = await User.create({
    name: 'Pranav M',
    email: 'pranav@example.com',
    password: 'password123',
  });
  const user4 = await User.create({
    name: 'Chandan R',
    email: 'chandan@example.com',
    password: 'password123',
  });
  console.log(`Created 4 users: ${user1.name}, ${user2.name}, ${user3.name}, ${user4.name}`);

  // 2. Create Group
  console.log('\n--- 2. Creating Group ---');
  const group = await Group.create({
    name: 'Flat 402 Roommates',
    description: 'Shared expenses for rent, groceries, and weekend trips',
    createdBy: user1._id,
    members: [user1._id, user2._id, user3._id, user4._id],
  });
  console.log(`Created group: "${group.name}" with 4 members.`);

  // 3. Add Equal Split Expense (Groceries: ₹1,200)
  // user1 pays ₹1,200, equal split among all 4 (₹300 each)
  console.log('\n--- 3. Adding Equal Split Expense ---');
  const exp1 = await Expense.create({
    groupId: group._id,
    title: 'Weekly Supermarket Groceries',
    amount: 120000, // 1200 INR in paise
    paidBy: user1._id,
    splitType: 'equal',
    category: 'groceries',
    description: 'Vegetables, milk, fruits, and bread',
    participants: [
      { user: user1._id, share: 30000 },
      { user: user2._id, share: 30000 },
      { user: user3._id, share: 30000 },
      { user: user4._id, share: 30000 },
    ],
  });
  console.log(`Added Expense 1: ₹1,200 paid by Chiranjeevi, equal split ₹300 each`);

  // 4. Add Custom Split Expense (Dinner Outing: ₹1,600)
  // user2 (Gagan) pays ₹1,600
  // Chiranjeevi: ₹500, Gagan: ₹400, Pranav: ₹400, Chandan: ₹300
  console.log('\n--- 4. Adding Custom Split Expense ---');
  const exp2 = await Expense.create({
    groupId: group._id,
    title: 'Barbeque Nation Dinner',
    amount: 160000, // 1600 INR in paise
    paidBy: user2._id,
    splitType: 'custom',
    category: 'food',
    description: 'Friday team dinner',
    participants: [
      { user: user1._id, share: 50000 }, // 500 INR
      { user: user2._id, share: 40000 }, // 400 INR
      { user: user3._id, share: 40000 }, // 400 INR
      { user: user4._id, share: 30000 }, // 300 INR
    ],
  });
  console.log(`Added Expense 2: ₹1,600 paid by Gagan with custom shares (₹500 + ₹400 + ₹400 + ₹300 = ₹1,600)`);

  // 5. Add Utilities Expense (WiFi & Electricity: ₹1,400)
  // user3 (Pranav) pays ₹1,400, equal split (₹350 each)
  console.log('\n--- 5. Adding Utilities Expense ---');
  const exp3 = await Expense.create({
    groupId: group._id,
    title: 'High-speed Fiber Internet & Power',
    amount: 140000, // 1400 INR in paise
    paidBy: user3._id,
    splitType: 'equal',
    category: 'utilities',
    description: 'Monthly broadband and electricity bill',
    participants: [
      { user: user1._id, share: 35000 },
      { user: user2._id, share: 35000 },
      { user: user3._id, share: 35000 },
      { user: user4._id, share: 35000 },
    ],
  });
  console.log(`Added Expense 3: ₹1,400 paid by Pranav, equal split ₹350 each`);

  // 6. Test Balances Calculation
  console.log('\n--- 6. Calculating Net Balances ---');
  const allExpenses = [exp1, exp2, exp3];
  const balances = calculateBalances(allExpenses, []);

  const userMap = {
    [user1._id.toString()]: user1.name,
    [user2._id.toString()]: user2.name,
    [user3._id.toString()]: user3.name,
    [user4._id.toString()]: user4.name,
  };

  let sum = 0;
  for (const [uid, bal] of balances) {
    sum += bal;
    const sign = bal > 0 ? '+' : '';
    console.log(`  ${userMap[uid]}: ${sign}₹${(bal / 100).toFixed(2)} (${bal > 0 ? 'Owed to them' : 'Owes to group'})`);
  }
  console.log(`Net balance sum verification: ${sum} paise (must be 0)`);
  if (sum !== 0) throw new Error('Balance sum is not zero!');

  // 7. Test Smart Settlement Engine
  console.log('\n--- 7. Running Smart Settlement Optimization ---');
  const transactions = optimizeSettlements(balances);
  console.log(`Optimized into ${transactions.length} transactions:`);
  for (const t of transactions) {
    console.log(`  💸 ${userMap[t.from]} ➜ pays ₹${(t.amount / 100).toFixed(2)} to ${userMap[t.to]}`);
  }

  // 8. Test Executing and Marking a Settlement as Paid
  console.log('\n--- 8. Recording and Settling First Payment ---');
  const firstTx = transactions[0];
  const settlementDoc = await Settlement.create({
    groupId: group._id,
    from: firstTx.from,
    to: firstTx.to,
    amount: firstTx.amount,
    status: 'paid',
    settledAt: new Date(),
  });
  console.log(`Settlement recorded as PAID: ${userMap[firstTx.from]} -> ${userMap[firstTx.to]} (₹${(firstTx.amount / 100).toFixed(2)})`);

  // 9. Re-calculate Balances after settlement
  console.log('\n--- 9. Balances After Settlement ---');
  const balancesAfter = calculateBalances(allExpenses, [settlementDoc]);
  for (const [uid, bal] of balancesAfter) {
    const sign = bal > 0 ? '+' : '';
    console.log(`  ${userMap[uid]}: ${sign}₹${(bal / 100).toFixed(2)}`);
  }
  const remainingTx = optimizeSettlements(balancesAfter);
  console.log(`Remaining transactions to settle: ${remainingTx.length}`);
  for (const t of remainingTx) {
    console.log(`  💸 ${userMap[t.from]} ➜ pays ₹${(t.amount / 100).toFixed(2)} to ${userMap[t.to]}`);
  }

  await mongoose.disconnect();
  console.log('\nAll tests and demo seeding completed successfully! ✨');
}

run().catch((err) => {
  console.error('Test/Seed failed:', err);
  process.exit(1);
});
