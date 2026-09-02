const express = require('express')

const { createTransaction, getTransactions, getTransactionSummary, categorySummary, monthlySummary } = require("../controllers/transactionController")

const router = express.Router()

router.post("/", createTransaction)
router.get("/summary", getTransactionSummary)
router.get("/category-summary", categorySummary)
router.get("/monthly-summary", monthlySummary)
router.get("/", getTransactions)

module.exports = router