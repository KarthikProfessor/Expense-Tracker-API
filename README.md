# 💰 Expense Tracker API

A backend REST API for managing personal income and expenses. This project is built with **Node.js, Express.js, MongoDB, and Mongoose** and includes transaction filtering, sorting, pagination, date-range queries, and MongoDB aggregation-based financial reports.

---

## 🚀 Features

- Create income and expense transactions
- Filter transactions by type and category
- Filter transactions by date range
- Sort transactions by amount or other fields
- Pagination with metadata
- Calculate total income
- Calculate total expenses
- Calculate current balance
- Category-wise expense analysis
- Monthly financial reports
- MongoDB aggregation pipelines
- Centralized error handling
- Input validation using Mongoose
- Environment variable configuration

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM |
| dotenv | Environment variable management |
| Postman | API testing |
| Git & GitHub | Version control |

---

## 📁 Project Structure

```text
expense-tracker/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── transactionController.js
│
├── middleware/
│   ├── asyncHandler.js
│   └── errorMiddleware.js
│
├── models/
│   └── Transaction.js
│
├── routes/
│   └── transactionRoutes.js
│
├── .env
├── .gitignore
├── app.js
├── server.js
├── package.json
└── package-lock.json
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Navigate into the project

```bash
cd expense-tracker
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create `.env`

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

### 5. Start the development server

```bash
npm run dev
```

The server will run at:

```text
http://localhost:3000
```

---

## 📊 Transaction Model

Each transaction contains:

```text
title
amount
type
category
date
description
```

### Example

```json
{
  "title": "Grocery Shopping",
  "amount": 2500,
  "type": "expense",
  "category": "Food",
  "date": "2026-08-20",
  "description": "Monthly groceries"
}
```

### Transaction Types

The `type` field accepts only:

```text
income
expense
```

---

# 🔌 API Endpoints

## 1. Create Transaction

### `POST /api/transactions`

Creates a new income or expense transaction.

### Request

```json
{
  "title": "Monthly Salary",
  "amount": 50000,
  "type": "income",
  "category": "Salary",
  "date": "2026-08-01",
  "description": "August salary"
}
```

### Response

```json
{
  "_id": "66...",
  "title": "Monthly Salary",
  "amount": 50000,
  "type": "income",
  "category": "Salary",
  "date": "2026-08-01T00:00:00.000Z",
  "description": "August salary"
}
```

---

# 2. Get Transactions

### `GET /api/transactions`

Returns transactions with optional filtering, sorting, pagination, and date-range filtering.

### Get all transactions

```http
GET /api/transactions
```

---

## 🔎 Filter by Type

### Expenses

```http
GET /api/transactions?type=expense
```

### Income

```http
GET /api/transactions?type=income
```

---

## 🔎 Filter by Category

```http
GET /api/transactions?category=Food
```

---

## 🔎 Multiple Filters

```http
GET /api/transactions?type=expense&category=Food
```

---

# 📅 Date Filtering

### Start date

```http
GET /api/transactions?startDate=2026-08-01
```

### End date

```http
GET /api/transactions?endDate=2026-08-31
```

### Date range

```http
GET /api/transactions?startDate=2026-08-01&endDate=2026-08-31
```

---

# 🔃 Sorting

### Amount — ascending

```http
GET /api/transactions?sort=amount
```

### Amount — descending

```http
GET /api/transactions?sort=-amount
```

---

# 📄 Pagination

### Page 1 with 10 transactions

```http
GET /api/transactions?page=1&limit=10
```

### Page 2 with 5 transactions

```http
GET /api/transactions?page=2&limit=5
```

The response contains pagination metadata:

```json
{
  "data": [],
  "pagination": {
    "currentPage": 1,
    "limit": 10,
    "totalTransactions": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

# 📈 Financial Summary

### `GET /api/transactions/summary`

Returns total income, total expenses, and balance.

```json
{
  "totalIncome": 60000,
  "totalExpense": 12500,
  "balance": 47500
}
```

### Calculation

```text
Balance = Total Income - Total Expense
```

---

# 📊 Category-wise Expense Summary

### `GET /api/transactions/category-summary`

Returns the total spending for each expense category.

### Example response

```json
[
  {
    "category": "Food",
    "total": 4500
  },
  {
    "category": "Shopping",
    "total": 5000
  },
  {
    "category": "Travel",
    "total": 2300
  }
]
```

The results are sorted from highest spending to lowest spending.

---

# 📅 Monthly Financial Summary

### `GET /api/transactions/monthly-summary`

Returns income, expenses, and balance for each month.

### Example response

```json
[
  {
    "year": 2026,
    "month": 8,
    "income": 60000,
    "expense": 12500,
    "balance": 47500
  },
  {
    "year": 2026,
    "month": 9,
    "income": 50000,
    "expense": 8000,
    "balance": 42000
  }
]
```

---

# 🧮 MongoDB Aggregation

This project uses MongoDB aggregation pipelines for financial analysis.

### Aggregation operators used

```text
$match
$group
$sum
$cond
$eq
$sort
$project
$year
$month
$subtract
```

### Example

The category summary uses:

```javascript
Transaction.aggregate([
  {
    $match: {
      type: "expense"
    }
  },
  {
    $group: {
      _id: "$category",
      total: {
        $sum: "$amount"
      }
    }
  },
  {
    $sort: {
      total: -1
    }
  }
]);
```

This pipeline:

```text
All transactions
      ↓
Only expenses
      ↓
Group by category
      ↓
Calculate total spending
      ↓
Sort highest → lowest
```

---

# 🛡️ Error Handling

The project uses centralized error handling middleware.

```text
Controller
    ↓
Error
    ↓
asyncHandler
    ↓
next(error)
    ↓
errorMiddleware
    ↓
HTTP Response
```

The API handles:

- Mongoose validation errors
- Invalid MongoDB IDs
- Invalid query parameters
- Unexpected server errors

---

# 🧪 API Testing

The API can be tested using **Postman**.

Recommended test cases:

### Valid requests

```text
POST /api/transactions
GET /api/transactions
GET /api/transactions?type=expense
GET /api/transactions?category=Food
GET /api/transactions?sort=-amount
GET /api/transactions?page=1&limit=5
GET /api/transactions/summary
GET /api/transactions/category-summary
GET /api/transactions/monthly-summary
```

### Invalid requests

```text
GET /api/transactions?type=shopping
GET /api/transactions?page=abc
GET /api/transactions?page=0
GET /api/transactions?limit=1000
```

---

# 🔐 Environment Variables

The following environment variables are required:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

**Never commit your `.env` file to GitHub.**

Add this to `.gitignore`:

```text
node_modules/
.env
```

---

# 🧠 Concepts Learned

This project covers several important backend concepts:

### Node.js & Express

- Express server setup
- Routes
- Controllers
- Middleware
- Error-handling middleware
- Query parameters
- Request body
- Async operations

### MongoDB & Mongoose

- Schema design
- Models
- Validation
- Queries
- Filtering
- Sorting
- Pagination
- Date queries
- Aggregation pipelines

### MongoDB Aggregation

- `$match`
- `$group`
- `$sum`
- `$cond`
- `$eq`
- `$sort`
- `$project`
- `$year`
- `$month`
- `$subtract`

---

# 🚀 Future Improvements

Possible features for future versions:

- User authentication with JWT
- User-specific transactions
- Update transactions
- Delete transactions
- Recurring transactions
- Budget management
- Monthly spending limits
- Expense notifications
- CSV/PDF reports
- Dashboard API
- Redis caching
- Rate limiting
- API documentation with Swagger
- Unit and integration testing

---

# 📌 Learning Outcome

This project was built to progress beyond basic CRUD APIs and understand how real-world backend APIs process and analyze data.

The major progression was:

```text
Basic CRUD
    ↓
Query Parameters
    ↓
Filtering
    ↓
Sorting
    ↓
Pagination
    ↓
Date Filtering
    ↓
MongoDB Aggregation
    ↓
Financial Analytics
    ↓
Centralized Error Handling
```

---

## 👨‍💻 Author

**Karthik Raju**

Full-Stack Developer | Node.js | Express.js | MongoDB | React.js

---

## ⭐ If you found this project useful

Give the repository a ⭐ on GitHub.
