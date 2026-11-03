/**
 * Smart Settlement Engine
 *
 * Uses a greedy creditor-debtor matching algorithm to minimize
 * the number of transactions needed to settle all debts.
 *
 * All amounts are in integer paise to avoid floating-point errors.
 */

/**
 * Calculate net balances for each member in a group from expenses and settlements.
 *
 * @param {Array} expenses - Array of expense documents
 * @param {Array} settlements - Array of paid settlement documents
 * @returns {Map<string, number>} Map of userId -> net balance in paise
 *
 * Positive balance = person is owed money (creditor)
 * Negative balance = person owes money (debtor)
 */
function calculateBalances(expenses, settlements = []) {
  const balances = new Map();

  for (const expense of expenses) {
    const payerId = expense.paidBy.toString();

    // Payer paid the full amount, so they are credited
    balances.set(payerId, (balances.get(payerId) || 0) + expense.amount);

    // Each participant owes their share
    for (const participant of expense.participants) {
      const userId = participant.user.toString();
      balances.set(userId, (balances.get(userId) || 0) - participant.share);
    }
  }

  // Account for paid settlements
  for (const settlement of settlements) {
    if (settlement.status === 'paid') {
      const fromId = settlement.from.toString();
      const toId = settlement.to.toString();
      // 'from' paid 'to', so from's balance goes up (less debt), to's goes down (less owed)
      balances.set(fromId, (balances.get(fromId) || 0) + settlement.amount);
      balances.set(toId, (balances.get(toId) || 0) - settlement.amount);
    }
  }

  // Remove zero balances
  for (const [userId, balance] of balances) {
    if (balance === 0) {
      balances.delete(userId);
    }
  }

  return balances;
}

/**
 * Optimize settlements using greedy creditor-debtor matching.
 *
 * Algorithm:
 * 1. Separate members into creditors (+) and debtors (-).
 * 2. Sort both by absolute balance descending.
 * 3. Match largest debtor with largest creditor.
 * 4. Transfer min(|debt|, credit).
 * 5. Update and repeat until all settled.
 *
 * @param {Map<string, number>} balances - Map of userId -> net balance in paise
 * @returns {Array<{from: string, to: string, amount: number}>} Optimized transactions
 */
function optimizeSettlements(balances) {
  // Validate that balances sum to zero
  let total = 0;
  for (const balance of balances.values()) {
    total += balance;
  }
  if (Math.abs(total) > 1) {
    // Allow 1 paisa rounding tolerance
    throw new Error(
      `Balances do not sum to zero (sum = ${total}). Cannot optimize.`
    );
  }

  // Separate into creditors and debtors
  const creditors = []; // positive balance: owed money
  const debtors = []; // negative balance: owe money

  for (const [userId, balance] of balances) {
    if (balance > 0) {
      creditors.push({ userId, amount: balance });
    } else if (balance < 0) {
      debtors.push({ userId, amount: -balance }); // store as positive
    }
  }

  // Sort descending by amount
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];

  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci];
    const debtor = debtors[di];

    const transferAmount = Math.min(creditor.amount, debtor.amount);

    if (transferAmount > 0) {
      transactions.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: transferAmount,
      });
    }

    creditor.amount -= transferAmount;
    debtor.amount -= transferAmount;

    if (creditor.amount === 0) ci++;
    if (debtor.amount === 0) di++;
  }

  return transactions;
}

module.exports = {
  calculateBalances,
  optimizeSettlements,
};

