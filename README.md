# SplitSimple — Smart Group Expense Tracker & Settlement Platform

**Project Owner:** CHIRANJEEVI S  
**Category:** Shared Expense Settlement & Financial Management

SplitSimple is a full-stack group expense management platform designed for roommates, friends, and travel groups. It eliminates the confusion of shared expenses by tracking contributions, calculating real-time net balances, and using an **intelligent debt simplification algorithm** to minimize the number of repayments needed to settle all debts.

---

## 🚀 Key Features

1. **Smart Debt Settlement Engine (Core Feature)**:
   - Uses a greedy creditor-debtor matching algorithm to reduce $N(N-1)/2$ potential debts down to at most $N-1$ clean transactions.
   - Calculates balances with integer paise precision (zero floating-point errors).
   - Real-time balance updates when a settlement is marked as paid.
   - Prevention of duplicate or over-settlement transactions.

2. **Group Management**:
   - Create and customize groups with descriptions and participant rosters.
   - Seamless member lookup by email.
   - Group spending overview, member balances, and full expense history.

3. **Flexible Expense Splitting**:
   - **Equal Split**: Automatically divides any amount evenly with remainder distribution down to the exact paisa.
   - **Custom Split**: Manually allocate exact participant shares with immediate sum validation.
   - Categorize by Food, Groceries, Rent, Utilities, Transport, Entertainment, and more.

4. **Interactive Analytics & Dashboards**:
   - Total group expenses, amounts owed, and amounts receivable.
   - Visual spending trends and monthly category breakdowns powered by Recharts.
   - Real-time balances table (positive = to receive, negative = to pay).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, React Router v6, Lucide React, Recharts, Axios, React Hot Toast
- **Backend**: Node.js, Express.js, REST API, JWT Authentication, bcryptjs password hashing, express-validator
- **Database**: MongoDB 8.0+, Mongoose ODM
- **Testing**: Node.js built-in test runner (`node --test`)

---

## 📁 Project Structure

```
SplitSimple/
├── backend/
│   ├── config/         # MongoDB connection setup
│   ├── controllers/    # Auth, Group, Expense, Settlement, Dashboard controllers
│   ├── middleware/     # JWT Auth, express-validator, Centralized Error Handling
│   ├── models/         # User, Group, Expense, Settlement schemas
│   ├── routes/         # Express REST API routes
│   ├── services/       # Smart Settlement Engine (greedy algorithm)
│   ├── tests/          # Automated unit tests for balance & settlement logic
│   ├── scripts/        # Seeding and end-to-end verification script
│   └── server.js       # Express server entry point (Port 5000)
├── frontend/
│   ├── src/
│   │   ├── components/ # ProtectedRoute, Reusable UI widgets
│   │   ├── context/    # AuthContext with persistent JWT session
│   │   ├── layouts/    # AppLayout with responsive sidebar & mobile drawer
│   │   ├── pages/      # Landing, Login, Register, Dashboard, Groups, Expenses, Balances, Settlements, Analytics
│   │   ├── services/   # Axios API client modules
│   │   └── utils/      # Currency formatters (INR), date helpers, category configs
│   ├── index.html
│   └── vite.config.js  # Vite config with API proxy to port 5000
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **MongoDB**: v6.0+ running on `mongodb://127.0.0.1:27017`

### 2. Backend Setup
```bash
cd backend
npm install
node scripts/seedAndVerify.js   # Seeds demo users, group, and runs verification
node server.js                  # Starts API on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev                     # Starts Vite on http://localhost:5173
```

---

## 🔑 Demo Accounts (Pre-seeded)

All accounts share the password: `password123`

| Name | Email | Role / State |
|---|---|---|
| **CHIRANJEEVI S** (Owner) | `chiranjeevi@example.com` | Creditor (Flat creator, owed ₹50.00) |
| **Gagan K** | `gagan@example.com` | Settled (Paid dinner, received ₹550.00 settlement) |
| **Pranav M** | `pranav@example.com` | Creditor (Paid utilities, owed ₹350.00) |
| **Chandan R** | `chandan@example.com` | Debtor (Owes remaining ₹400.00 to group) |

---

## 🧪 Testing

Run backend tests:
```bash
cd backend
node --test tests/settlementEngine.test.js
```
All 11 unit test suites cover:
- Equal split balance calculation
- Custom split share validation
- Multi-payer multi-expense resolution
- Paid settlement deductions
- Greedy settlement transaction minimization
- Complex multi-creditor/multi-debtor scenarios
- Conservation of balance sums ($O(0)$ net drift)

---

## 🌐 Live URLs

- **Web Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Endpoint**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

