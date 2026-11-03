const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateBalances,
  optimizeSettlements,
} = require('../services/settlementEngine');

describe('calculateBalances', () => {
  it('should return empty map for no expenses', () => {
    const result = calculateBalances([]);
    assert.equal(result.size, 0);
  });

  it('should correctly calculate equal split', () => {
    const expenses = [
      {
        paidBy: 'user1',
        amount: 120000, // ₹1200
        participants: [
          { user: 'user1', share: 30000 },
          { user: 'user2', share: 30000 },
          { user: 'user3', share: 30000 },
          { user: 'user4', share: 30000 },
        ],
      },
    ];

    const balances = calculateBalances(expenses);

    // user1 paid 1200, owes 300 => net +900
    assert.equal(balances.get('user1'), 90000);
    // user2 owes 300 => net -300
    assert.equal(balances.get('user2'), -30000);
    assert.equal(balances.get('user3'), -30000);
    assert.equal(balances.get('user4'), -30000);
  });

  it('should correctly calculate custom split', () => {
    const expenses = [
      {
        paidBy: 'user1',
        amount: 120000,
        participants: [
          { user: 'user1', share: 40000 },
          { user: 'user2', share: 30000 },
          { user: 'user3', share: 20000 },
          { user: 'user4', share: 30000 },
        ],
      },
    ];

    const balances = calculateBalances(expenses);

    assert.equal(balances.get('user1'), 80000); // 1200 - 400 = +800
    assert.equal(balances.get('user2'), -30000);
    assert.equal(balances.get('user3'), -20000);
    assert.equal(balances.get('user4'), -30000);
  });

  it('should handle multiple expenses', () => {
    const expenses = [
      {
        paidBy: 'user1',
        amount: 60000, // ₹600
        participants: [
          { user: 'user1', share: 30000 },
          { user: 'user2', share: 30000 },
        ],
      },
      {
        paidBy: 'user2',
        amount: 40000, // ₹400
        participants: [
          { user: 'user1', share: 20000 },
          { user: 'user2', share: 20000 },
        ],
      },
    ];

    const balances = calculateBalances(expenses);

    // user1: paid 600, owes 300+200=500 => +100
    assert.equal(balances.get('user1'), 10000);
    // user2: paid 400, owes 300+200=500 => -100
    assert.equal(balances.get('user2'), -10000);
  });

  it('should account for paid settlements', () => {
    const expenses = [
      {
        paidBy: 'user1',
        amount: 60000,
        participants: [
          { user: 'user1', share: 30000 },
          { user: 'user2', share: 30000 },
        ],
      },
    ];

    const settlements = [
      {
        from: 'user2',
        to: 'user1',
        amount: 30000,
        status: 'paid',
      },
    ];

    const balances = calculateBalances(expenses, settlements);

    // All should be settled (zero)
    assert.equal(balances.size, 0);
  });
});

describe('optimizeSettlements', () => {
  it('should return empty array for no balances', () => {
    const result = optimizeSettlements(new Map());
    assert.deepEqual(result, []);
  });

  it('should handle simple two-person settlement', () => {
    const balances = new Map([
      ['user1', 30000], // owed ₹300
      ['user2', -30000], // owes ₹300
    ]);

    const result = optimizeSettlements(balances);

    assert.equal(result.length, 1);
    assert.equal(result[0].from, 'user2');
    assert.equal(result[0].to, 'user1');
    assert.equal(result[0].amount, 30000);
  });

  it('should minimize transactions for multiple members', () => {
    // Chiranjeevi: +1000, Gagan: -500, Pranav: -300, Chandan: -200
    const balances = new Map([
      ['chiranjeevi', 100000],
      ['gagan', -50000],
      ['pranav', -30000],
      ['chandan', -20000],
    ]);

    const result = optimizeSettlements(balances);

    // Should produce 3 transactions (one per debtor)
    assert.equal(result.length, 3);

    // Total transferred should be 1000
    const totalTransferred = result.reduce((sum, t) => sum + t.amount, 0);
    assert.equal(totalTransferred, 100000);

    // All should go to chiranjeevi
    for (const t of result) {
      assert.equal(t.to, 'chiranjeevi');
    }
  });

  it('should handle complex multi-creditor scenario', () => {
    const balances = new Map([
      ['A', 50000],  // +500
      ['B', 30000],  // +300
      ['C', -40000], // -400
      ['D', -20000], // -200
      ['E', -20000], // -200
    ]);

    const result = optimizeSettlements(balances);

    // Verify total amounts balance
    const totalFrom = result.reduce((s, t) => s + t.amount, 0);
    assert.equal(totalFrom, 80000); // total debt = 800

    // Verify no transaction exceeds any party's balance
    const creditorReceived = {};
    const debtorPaid = {};
    for (const t of result) {
      creditorReceived[t.to] = (creditorReceived[t.to] || 0) + t.amount;
      debtorPaid[t.from] = (debtorPaid[t.from] || 0) + t.amount;
    }

    assert.ok(creditorReceived['A'] <= 50000);
    assert.ok(creditorReceived['B'] <= 30000);
    assert.ok(debtorPaid['C'] <= 40000);
    assert.ok((debtorPaid['D'] || 0) <= 20000);
    assert.ok((debtorPaid['E'] || 0) <= 20000);
  });

  it('should throw when balances do not sum to zero', () => {
    const balances = new Map([
      ['A', 50000],
      ['B', -30000],
    ]);

    assert.throws(
      () => optimizeSettlements(balances),
      /do not sum to zero/
    );
  });

  it('should handle already-settled group', () => {
    const balances = new Map(); // empty = all settled
    const result = optimizeSettlements(balances);
    assert.deepEqual(result, []);
  });
});

