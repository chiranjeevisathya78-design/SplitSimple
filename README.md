# SplitSimple — Smart Group Expense Tracker & Settlement Platform

**Project Owner:** CHIRANJEEVI S  
**Category:** Shared Expense Settlement & Financial Management  
**Design System:** Steep Minimal Editorial SaaS (Ink Black `#17191c`, Paper White `#ffffff`, Mist Gray `#f2f2f3`, Fog White `#fafafb`, Slate Gray `#777b86`, Blush Peach `#fbe1d1`, Sienna Brown `#5d2a1a`)

SplitSimple is a full-stack group expense management platform designed for roommates, friends, and travel groups. It eliminates the confusion of shared expenses by tracking contributions, calculating real-time net balances, and using an **intelligent debt simplification algorithm** to minimize the number of repayments needed to settle all debts.

---

## 🚀 Key Features

1. **Steep Editorial Design System**:
   - Clean, trustworthy, financial SaaS visual identity with minimal editorial typography (Source Serif 4 for headings, Inter for interface elements).
   - Card radius of 24px, pill buttons (`rounded-full`), 16px radius inputs, and subtle `#f2f2f3` borders.
   - Max 1200px width with structured whitespace and zero loud AI gradients.

2. **Smart Debt Settlement Engine (Core Feature)**:
   - Uses a greedy creditor-debtor matching algorithm to reduce $N(N-1)/2$ potential debts down to at most $N-1$ clean transactions.
   - Calculates balances with integer paise precision (zero floating-point errors).
   - Real-time balance updates when a settlement is marked as paid.
   - Prevention of duplicate or over-settlement transactions.

3. **Prebuilt Demo Workspace & One-Click Demo Mode**:
   - Includes 5 sample users (Chiranjeevi, Gagan, Pranav, Chandan, Rahul).
   - 3 Pre-populated groups:
     - **Bangalore Roommates** (Flat 402 rent, groceries, electricity, fiber Wi-Fi, water, cleaning)
     - **Goa Trip** (Beach villa, scooter rentals, seafood dinner, scuba diving, boat cruise)
     - **College Friends** (IMAX movies, burgers, night football turf, coffee catchups)
   - ~20 realistic expenses in INR with both equal and custom splits.
   - Completed historical settlements and one-click demo data reset (`POST /api/demo/reset`).

4. **Group & Expense Management**:
   - Create and customize groups with descriptions and participant rosters.
   - Seamless member lookup by email.
   - Group spending overview, member balances, and full expense history.
   - **Equal Split**: Automatically divides any amount evenly with remainder distribution down to the exact paisa.
   - **Custom Split**: Manually allocate exact participant shares with immediate sum validation.

5. **Interactive Analytics & Dashboards**:
   - Total group expenses, amounts owed, and amounts receivable.
   - Visual spending trends and monthly category breakdowns powered by Recharts with Steep aesthetic tokens.
   - Real-time balances table (positive = to receive, negative = to pay).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, React Router v6, Lucide React, Recharts, Axios, React Hot Toast
- **Backend**: Node.js, Express.js, REST API, JWT Authentication, bcryptjs password hashing, express-validator
- **Database**: MongoDB 8.0+, Mongoose ODM
- **Testing**: Node.js built-in test runner (`node --test`)

---

## 📁 Project Structure

```text
SplitSimple/
├── backend/
│   ├── config/         # MongoDB connection setup
│   ├── controllers/    # Auth, Group, Expense, Settlement, Dashboard controllers
│   ├── middleware/     # JWT Auth, express-validator, Centralized Error Handling
│   ├── models/         # User, Group, Expense, Settlement schemas
│   ├── routes/         # REST API routes (auth, groups, expenses, settlements, dashboard, demo)
│   ├── services/       # Smart Settlement Engine (greedy algorithm), Demo Seeder
│   ├── tests/          # Automated unit tests for balance & settlement logic
│   ├── scripts/        # Seeding and end-to-end verification script
│   └── server.js       # Express server entry point (Port 5000)
├── frontend/
│   ├── src/
│   │   ├── components/ # Button, Input, Select, StatCard, MemberAvatar, ErrorBoundary
│   │   ├── context/    # AuthContext with persistent JWT session
│   │   ├── layouts/    # AppLayout with responsive sidebar & mobile drawer
│   │   ├── pages/      # Landing, Login, Register, Dashboard, Groups, GroupDetail, Expenses, CreateExpense, Balances, Settlements, Analytics
│   │   ├── services/   # Axios API client modules
│   │   └── utils/      # Currency formatters (INR), date helpers, category configs
│   ├── index.html      # Google Fonts (Source Serif 4 + Inter)
│   ├── vite.config.js  # Vite config with API proxy to port 5000
│   └── package.json
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
| **CHIRANJEEVI S** (Owner) | `chiranjeevi@example.com` | Creditor (Flat creator, active in all groups) |
| **Gagan K** | `gagan@example.com` | Active Member (Bangalore Roommates, Goa Trip) |
| **Pranav M** | `pranav@example.com` | Active Member (Bangalore Roommates, Goa Trip, College Friends) |
| **Chandan R** | `chandan@example.com` | Active Member (All 3 groups) |
| **Rahul V** | `rahul@example.com` | Active Member (Goa Trip, College Friends) |

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
- **Demo Reset Endpoint**: `POST http://localhost:5000/api/demo/reset`
