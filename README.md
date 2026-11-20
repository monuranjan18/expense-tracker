# FinanceFlow - Personal Expense Tracker Web Application

FinanceFlow is a modern, responsive, and secure Personal Expense Tracker built with **React**, **Vite**, **Tailwind CSS**, **Chart.js**, and **Firebase**. It empowers individuals to manage daily transactions, analyze spending trends, set category-wise budgets, and achieve financial goals with intuitive visuals and real-time synchronization.

---

## 🌟 Key Features

### 1. 🔐 Authentication & Per-User Data Isolation
- **Email & Password Authentication**: Easy registration and login with input validation.
- **Google Sign-In**: 1-click Google OAuth authentication.
- **Protected Routes**: Secure client-side routing preventing unauthorized access.
- **User Isolation**: Strictly scoped Firestore security rules ensuring users can only read and write their own financial records (`users/{userId}/transactions` and `users/{userId}/budgets`).
- **Instant Demo Mode**: 1-click preview mode allowing exploration with sample data even without immediate Firebase setup.

### 2. 📊 Executive Financial Dashboard
- **Real-Time Stat Cards**:
  - **Total Balance** (current net balance)
  - **Total Income** (all-time earnings)
  - **Total Expenses** (all-time spendings)
  - **Monthly Savings** (savings amount and percentage rate for the current month)
- **Monthly Summary Banner**: Dynamic high-level performance greeting.
- **Interactive Charts**: Income vs. Expenses comparison and category expense doughnut breakdown.
- **Recent Transactions**: Quick view of recent operations with direct edit/delete capabilities.
- **Budget Health Overview**: Real-time category budget status and active spending alert banners.

### 3. 💸 Transaction Management (Full CRUD)
- **Record Income & Expenses**: Track amount, date, category, payment method (UPI, Credit/Debit card, Cash, Bank Transfer), description, and optional notes.
- **Edit & Delete**: Seamless modal editing and safe confirmation dialogs for deletion.
- **Search & Multi-Level Filtering**:
  - Instant text search across descriptions, categories, payment methods, and notes.
  - Type toggle (All, Expenses, Income).
  - Category filter dropdown.
  - Date range filtering (From Date - To Date).
  - Sorting options (Newest, Oldest, Highest amount, Lowest amount).
- **Default Categories**:
  - *Income*: Salary, Freelancing, Business, Investment, Other.
  - *Expenses*: Food, Shopping, Transport, Education, Entertainment, Healthcare, Bills, Travel, Other.

### 4. 📈 Rich Visual Analytics (Chart.js & react-chartjs-2)
- **Category Expense Doughnut Chart**: Interactive distribution with percentage tooltips.
- **Monthly Income vs. Expense Bar Chart**: 6-month historical view comparing inflows and outflows.
- **Spending Trend Line Chart**: Dynamic daily spending curve across customizable time windows (7, 14, 30, or 60 days).
- **Summary Metrics Breakdown**: Weekly spending change (vs prior 7 days), Monthly comparison, Average daily expenditure, and Top spending category.

### 5. 🎯 Budgeting & Spending Limits
- **Monthly Budgets**: Set spending caps on any expense category.
- **Real-Time Visual Progress Bars**: Color-coded progress (Green $\to$ Amber at 80% $\to$ Red when exceeded).
- **Proactive Spending Alerts**: Instant notification banners highlighting categories nearing or exceeding limits.
- **Remaining Budget Calculations**: Clear dollar/rupee amounts remaining or overspent.

### 6. 🛠️ SaaS UI/UX & Additional Utilities
- **Currency Customization**: Default **INR (₹)** with support for USD ($), EUR (€), GBP (£), JPY (¥), CAD (C$), and AUD (A$).
- **Theme Modes**: Modern Light and Dark theme with persistent preference storage.
- **CSV Data Export**: 1-click export of filtered or all transactions to `.csv` spreadsheet format.
- **Responsive Navigation**: Desktop sidebar layout and touch-friendly mobile bottom navigation.
- **Profile Management**: Update display name, email, and avatar profile URL.
- **Sample Data Seeding & Data Wipe**: Dedicated controls in Settings to reload realistic sample transactions or reset all data.

---

## 💻 Technology Stack

- **Frontend Core**: React 18, Vite 6, JavaScript (ES Modules)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Charts & Visuals**: Chart.js 4, react-chartjs-2
- **Icons**: Lucide React
- **Routing**: React Router DOM 6
- **Backend & Cloud Database**:
  - Firebase Authentication
  - Cloud Firestore
  - Firebase Hosting (production deployment)
- **Version Control**: Git & GitHub

---

## 📁 Project Structure

```
expense-tracker/
├── dist/                     # Optimized production build artifacts
├── public/                   # Static assets
├── src/
│   ├── assets/               # Media and vector assets
│   ├── components/
│   │   ├── common/           # Modal, ConfirmDialog, StatCard, Badge, EmptyState, etc.
│   │   ├── dashboard/        # SummaryCards, RecentTransactions, BudgetOverviewCard, etc.
│   │   ├── transactions/     # TransactionModal, TransactionFilters, TransactionItem, etc.
│   │   ├── budgets/          # BudgetCard, BudgetModal, BudgetProgressBar, etc.
│   │   └── analytics/        # CategoryExpenseChart, IncomeVsExpenseChart, SpendingTrendChart, etc.
│   ├── context/              # AuthContext, ThemeContext, CurrencyContext, TransactionContext
│   ├── firebase/             # config.js (Firebase client initialization and credentials check)
│   ├── hooks/                # Custom React lifecycle and state hooks
│   ├── layouts/              # MainLayout, Sidebar, Navbar, MobileBottomNav
│   ├── pages/                # DashboardPage, TransactionsPage, AnalyticsPage, BudgetsPage, SettingsPage, LoginPage, RegisterPage, NotFoundPage
│   ├── services/             # authService, transactionService, budgetService
│   ├── utils/                # constants, formatters, exportCsv, sampleData
│   ├── App.jsx               # Application routes and context provider tree
│   ├── index.css             # Tailwind CSS directives & global scrollbar styling
│   └── main.jsx              # React DOM entrypoint
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore patterns
├── firebase.json             # Firebase Hosting and Firestore configuration
├── firestore.rules           # Production Cloud Firestore Security Rules
├── package.json              # Dependencies and build scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind configuration (custom colors, fonts, dark mode)
├── vite.config.js            # Vite configuration with chunk splitting
└── README.md                 # Complete documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended, tested on v24)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Fill in your Firebase credentials in `.env`**:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Firebase Configuration & Security Rules

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new Firebase project (e.g. `expense-tracker-prod`).
3. Under **Authentication**, enable the **Email/Password** and **Google** sign-in providers.
4. Under **Firestore Database**, create a database in production mode.

### Step 2: Deploy Firestore Security Rules
The included `firestore.rules` file enforces complete data isolation between users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /transactions/{transactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /budgets/{budgetId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    match /{document=**} {
      allow read, write: false;
    }
  }
}
```

To deploy rules using the Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

---

## 🌐 Production Deployment (Firebase Hosting)

1. Build the production package:
   ```bash
   npm run build
   ```

2. Login to Firebase CLI (if not already logged in):
   ```bash
   firebase login
   ```

3. Initialize or link your project:
   ```bash
   firebase use --add
   ```

4. Deploy to Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```

---

## 📸 Screenshots & UI Preview

| View | Description |
| --- | --- |
| **Dashboard** | Total balance, monthly savings rate, income vs expenses chart, category breakdown, budget progress, and recent transactions. |
| **Transactions** | Comprehensive transactions ledger with real-time text search, type filters, category filters, date range filters, and CSV export. |
| **Analytics** | Spending trend line chart with customizable time windows (7–60 days), 6-month comparative bar chart, category doughnut chart, and week-over-week metrics. |
| **Budgets** | Category-wise budget limits, percentage utilization bars, remaining calculations, and overspending warnings. |
| **Settings** | Profile editing, default currency switcher (₹, $, €, £, etc.), light/dark theme toggle, Firebase connection indicator, and backup tools. |

---

## 📄 License
This project is licensed under the MIT License.
